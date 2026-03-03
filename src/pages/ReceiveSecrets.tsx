import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogContent,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppLayout } from '@/components/Layout/AppLayout';
import { AnalyticsDashboard, type AnalyticsDashboardRef } from '@/components/Analytics/AnalyticsDashboard';
import { SecretsList } from '@/components/Receive/SecretsList';
import { SearchSecretModal } from '@/components/Receive/SearchSecretModal';
import { FilePreviewList } from '@/components/Receive/FilePreviewList';
import { DecryptionProgressIndicator } from '@/components/Receive/DecryptionProgressIndicator';
import { SendSecretModal } from '@/components/Send/SendSecretModal';
import { InviteModal } from '@/components/Invite/InviteModal';
import { ConfirmDialog } from '@/components/Common/ConfirmDialog';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { usePigeonHoleAuth } from '@/hooks/usePigeonHoleAuth';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { useSecrets } from '@/hooks/useSecrets';
import { useCrypto } from '@/hooks/useCrypto';
import { downloadSecret, deleteSecret as apiDeleteSecret } from '@/services/api/secret.api';
import { deleteStoredKey } from '@/services/crypto/keyStorage';
import type { DecryptedFile } from '@/types/secret.types';

/**
 * View received secrets page
 */
export const ReceiveSecrets: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = usePigeonHoleAuth();
  const { checkHasKey } = useKeyManagement();
  const { secrets, isLoading, error: secretsError, removeFromState, refresh } = useSecrets(true);
  const { decryptData, decryptionProgress } = useCrypto();
  const { confirmDialogProps, showConfirm } = useConfirmDialog();
  const analyticsDashboardRef = useRef<AnalyticsDashboardRef>(null);

  const [downloadingSecretId, setDownloadingSecretId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [decryptedFiles, setDecryptedFiles] = useState<DecryptedFile[] | null>(null);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ stage: 'Ready', percent: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Check for key on mount
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      if (!checkHasKey(user.email)) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, user?.email, checkHasKey, navigate]);

  // Refresh secrets list every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [refresh]);

  // Handle download and decrypt
  const handleDownload = async (secretId: string) => {
    if (!user?.email) return;

    setDownloadingSecretId(secretId);
    setShowProgressDialog(true);
    setError(null);
    setDecryptedFiles(null);
    setDownloadProgress({ stage: 'Downloading...', percent: 0 });

    try {
      // Step 1: Download encrypted data
      const encryptedData = await downloadSecret(secretId, (percent) => {
        setDownloadProgress({ stage: 'Downloading...', percent });
      });

      // Step 2: Decrypt data
      setDownloadProgress({ stage: 'Decrypting...', percent: 0 });

      const files = await decryptData(encryptedData);

      setDownloadProgress({ stage: 'Complete!', percent: 100 });
      setDecryptedFiles(files);

      // Show file preview dialog
      setTimeout(() => {
        setShowProgressDialog(false);
        setShowFilesDialog(true);
      }, 1000);

      // Refresh secrets list to update downloaded status
      await refresh();
    } catch (err) {
      console.error('Download/decrypt failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to download and decrypt secret';
      setError(errorMessage);
      setShowProgressDialog(false);
    } finally {
      setDownloadingSecretId(null);
    }
  };

  // Handle delete
  const handleDelete = async (secretId: string) => {
    showConfirm({
      title: 'Delete Secret?',
      message: 'Are you sure you want to delete this secret? This action cannot be undone.',
      severity: 'warning',
      confirmColor: 'error',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          // Call API to delete the secret
          await apiDeleteSecret(secretId);

          // Delete matching local key if it exists
          const currentKey = window.localStorage.getItem(`${user?.email}_currentKey`);
          if (currentKey) {
            const parsedKey = JSON.parse(currentKey);
            if (parsedKey.fingerprint === secretId) {
              deleteStoredKey(user?.email || '');
            }
          }

          // Trigger exit animation
          setDeletingIds((prev) => new Set(prev).add(secretId));

          // Wait for animation to complete
          await new Promise((resolve) => setTimeout(resolve, 380));

          // Remove from state
          removeFromState(secretId);
        } catch (err) {
          console.error('Delete failed:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete secret');
          // Remove from deleting set if error occurs
          setDeletingIds((prev) => {
            const next = new Set(prev);
            next.delete(secretId);
            return next;
          });
        }
      },
    });
  };

  // Handle close files dialog
  const handleCloseFiles = () => {
    setShowFilesDialog(false);
    setDecryptedFiles(null);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setError(null);
    await refresh();
    analyticsDashboardRef.current?.refresh();
  };

  return (
    <AppLayout
      title="Nestbox Secrets"
      showSidebar
      showHeader
      showSearchBar
      onSearchClick={() => setShowSearchModal(true)}
      onSendClick={() => setShowSendModal(true)}
      onInviteClick={() => setShowInviteModal(true)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography color="primary.main" variant="h4" fontWeight={600}>
            My Vault
          </Typography>
          <Button
            variant="outlined"
            startIcon={isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Secrets sent to you appear here. Download and decrypt them securely.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <AnalyticsDashboard ref={analyticsDashboardRef} />

        {(error || secretsError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error || secretsError}
          </Alert>
        )}

        {isLoading && secrets.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <SecretsList
            secrets={secrets}
            onDownload={handleDownload}
            onDelete={handleDelete}
            downloadingSecretId={downloadingSecretId}
            deletingIds={deletingIds}
          />
        )}

        {/* Progress Dialog */}
        <Dialog
          open={showProgressDialog}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown
        >
          <DialogContent>
            <DecryptionProgressIndicator
              decryptionProgress={decryptionProgress}
              downloadProgress={downloadProgress}
            />
          </DialogContent>
        </Dialog>

        {/* Decrypted Files Dialog */}
        <Dialog
          open={showFilesDialog}
          onClose={handleCloseFiles}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            {decryptedFiles && (
              <FilePreviewList files={decryptedFiles} onClose={handleCloseFiles} />
            )}
          </DialogContent>
        </Dialog>

        {/* Search Modal */}
        <SearchSecretModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          secrets={secrets}
          onDownload={handleDownload}
          onDelete={handleDelete}
          downloadingSecretId={downloadingSecretId}
        />

        {/* Send Secret Modal */}
        <SendSecretModal
          open={showSendModal}
          onClose={() => setShowSendModal(false)}
        />

        {/* Invite Modal */}
        <InviteModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />

        {/* Confirm Dialog */}
        <ConfirmDialog {...confirmDialogProps} />
      </Box>
    </AppLayout>
  );
};
