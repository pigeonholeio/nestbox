import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import { AppLayout } from '@/components/Layout/AppLayout';
import { KeysList } from '@/components/Keys/KeysList';
import { SearchSecretModal } from '@/components/Receive/SearchSecretModal';
import { ConfirmDialog } from '@/components/Common/ConfirmDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { usePigeonHoleAuth } from '@/hooks/usePigeonHoleAuth';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { useSecrets } from '@/hooks/useSecrets';
import { useCrypto } from '@/hooks/useCrypto';
import { useAuthStore } from '@/stores/authStore';
import { useKeyStore } from '@/stores/keyStore';
import { getCurrentUserKeys, deletePublicKeyForUser, getCurrentUser } from '@/services/api/user.api';
import { downloadSecret } from '@/services/api/secret.api';
import { deleteStoredKey } from '@/services/crypto/keyStorage';
import type { UserKey } from '@/types/api.types';

/**
 * View and manage user's public keys page
 */
export const MyKeys: React.FC = () => {
  const { isAuthenticated } = usePigeonHoleAuth();
  const { confirmDialogProps, showConfirm } = useConfirmDialog();
  const { generateKey } = useKeyManagement();
  const { secrets, deleteSecret: deleteSecret_api } = useSecrets(true);
  const { decryptData } = useCrypto();
  const { auth0User } = useAuthStore();
  const { currentKey } = useKeyStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [keys, setKeys] = useState<UserKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingKeyId, setIsDeletingKeyId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const initializeUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUserId(currentUser.user.id);
      await loadKeys();
    } catch (err) {
      console.error('Failed to load user:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user');
    }
  }, []);

  // Load user ID and keys on mount
  useEffect(() => {
    if (isAuthenticated) {
      initializeUser();
    }
  }, [isAuthenticated, initializeUser]);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCurrentUserKeys();
      if (response && response.keys) {
        setKeys(response.keys);
      } else {
        setKeys([]);
      }
    } catch (err) {
      console.error('Failed to load keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to load keys');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (keyId: string) => {
    showConfirm({
      title: 'Delete Key?',
      message: 'Are you sure you want to delete this key? Recipients using this key will not be able to send you encrypted secrets.',
      severity: 'warning',
      confirmColor: 'error',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          setIsDeletingKeyId(keyId);

          // Get the key being deleted to check its thumbprint
          const keyToDelete = keys.find((k) => k.id === keyId);

          if (userId) {
            await deletePublicKeyForUser(userId, keyId);
          }

          // If the deleted key matches the current local key, delete it from browser storage
          if (keyToDelete && currentKey && keyToDelete.thumbprint === currentKey.thumbprint) {
            deleteStoredKey(currentKey.email);
            console.log('Deleted local key for user:', currentKey.email);
          }

          // Trigger exit animation
          setDeletingIds((prev) => new Set(prev).add(keyId));

          // Wait for animation to complete
          await new Promise((resolve) => setTimeout(resolve, 380));

          // Remove from local state
          setKeys((prev) => prev.filter((k) => k.id !== keyId));
        } catch (err) {
          console.error('Delete failed:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete key');
          // Remove from deleting set if error occurs
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(keyId);
            return next;
          });
        } finally {
          setIsDeletingKeyId(null);
        }
      },
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setError(null);
    await loadKeys();
  };

  // Handle regenerate keys button click
  const handleRegenerateClick = () => {
    setShowRegenerateWarning(true);
  };

  // Handle confirm regeneration
  const handleConfirmRegenerate = async () => {
    setShowRegenerateWarning(false);
    setIsRegenerating(true);

    try {
      // Store the OLD key's thumbprint BEFORE regeneration
      // (after generateKey(), currentKey will be updated to the NEW key)
      const oldKeyThumbprint = currentKey?.thumbprint;

      // Generate new key (this updates currentKey in the store to the NEW key)
      await generateKey();

      // After generating new key, delete any old keys from remote
      if (userId && oldKeyThumbprint) {
        // Reload to get the updated list (should now include the new key)
        const response = await getCurrentUserKeys();
        if (response && response.keys) {
          const updatedKeys = response.keys;

          // Find and delete any keys with the old thumbprint
          const oldKeysToDelete = updatedKeys.filter(k => k.thumbprint === oldKeyThumbprint);

          for (const oldKey of oldKeysToDelete) {
            try {
              await deletePublicKeyForUser(userId, oldKey.id);
              console.log('Deleted old key:', oldKey.id, 'with thumbprint:', oldKeyThumbprint);
            } catch (err) {
              console.error('Failed to delete old key:', oldKey.id, err);
            }
          }

          setKeys(updatedKeys);
        }
      }
    } catch (err) {
      console.error('Key regeneration failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to regenerate keys');
    } finally {
      setIsRegenerating(false);
      // Final reload to ensure we have the latest keys
      await loadKeys();
    }
  };

  // Handle download from search modal
  const handleDownload = async (secretId: string) => {
    if (!isAuthenticated) return;

    try {
      const encryptedData = await downloadSecret(secretId);
      if (auth0User?.email) {
        const files = await decryptData(encryptedData);
        console.log('Downloaded files:', files);
      }
    } catch (err) {
      console.error('Download/decrypt failed:', err);
    }
  };

  return (
    <AppLayout
      title="My Keys"
      showSidebar
      showHeader
      showSearchBar={true}
      onSearchClick={() => setShowSearchModal(true)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography color="primary.main" variant="h4" fontWeight={600}>
            My Keys
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<WarningIcon />}
              onClick={handleRegenerateClick}
              disabled={isLoading || isRegenerating}
              size="small"
            >
              Regenerate Browser Key
            </Button>
            <Button
              variant="outlined"
              startIcon={isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your public encryption keys. These are used to receive encrypted secrets from other users.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <KeysList
          keys={keys}
          onDelete={handleDelete}
          isDeletingKeyId={isDeletingKeyId}
          isLoading={isLoading}
          deletingIds={deletingIds}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog {...confirmDialogProps} />

        {/* Regenerate Keys Warning Dialog */}
        <Dialog
          open={showRegenerateWarning}
          onClose={() => !isRegenerating && setShowRegenerateWarning(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon sx={{ color: 'warning.main' }} />
            Regenerate Encryption Keys?
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Secrets Encrypted with Old Keys Will Be Irretrievable
              </Typography>
            </Alert>

            <Typography paragraph>
              When you regenerate your keys:
            </Typography>

            <Box component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography variant="body2" paragraph>
                  A new public/private key pair will be generated
                </Typography>
              </li>
              <li>
                <Typography variant="body2" paragraph>
                  Your old key will be replaced
                </Typography>
              </li>
              <li>
                <Typography variant="body2" paragraph>
                  <strong>Any secrets encrypted with your old public key will no longer be decryptable</strong>
                </Typography>
              </li>
              <li>
                <Typography variant="body2" paragraph>
                  Don't worry, your new public key will be automatically pushed to PigeonHole
                </Typography>
              </li>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Only proceed if you understand the consequences or if you no longer need to decrypt secrets sent with your current key.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setShowRegenerateWarning(false)}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRegenerate}
              variant="contained"
              color="warning"
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Regenerating...
                </>
              ) : (
                'Regenerate Browser Key'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search Modal */}
        <SearchSecretModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          secrets={secrets}
          onDownload={handleDownload}
          onDelete={deleteSecret_api}
          downloadingSecretId={null}
        />
      </Box>
    </AppLayout>
  );
};
