import React, { useState, useEffect } from 'react';
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
import { SecretsList } from '@/components/Receive/SecretsList';
import { SearchSecretModal } from '@/components/Receive/SearchSecretModal';
import { FilePreviewList } from '@/components/Receive/FilePreviewList';
import { DecryptionProgressIndicator } from '@/components/Receive/DecryptionProgressIndicator';
import { SendSecretModal } from '@/components/Send/SendSecretModal';
import { ConfirmDialog, useConfirmDialog } from '@/components/Common/ConfirmDialog';
import { usePigeonHoleAuth } from '@/hooks/usePigeonHoleAuth';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { useSecrets } from '@/hooks/useSecrets';
import { useCrypto } from '@/hooks/useCrypto';
import { downloadSecret } from '@/services/api/secret.api';
import { downloadFile } from '@/services/fileHandling/tarGz';
import type { DecryptedFile } from '@/types/secret.types';

/**
 * View received secrets page
 */
export const ReceiveSecrets: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = usePigeonHoleAuth();
  const { checkHasKey } = useKeyManagement();
  const { secrets, isLoading, error: secretsError, deleteSecret, refresh } = useSecrets(true);
  const { decryptData, decryptionProgress } = useCrypto();
  const { confirmDialogProps, showConfirm } = useConfirmDialog();

  const [downloadingSecretId, setDownloadingSecretId] = useState<string | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [decryptedFiles, setDecryptedFiles] = useState<DecryptedFile[] | null>(null);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ stage: 'Ready', percent: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

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
    }, 5000);

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

      const files = await decryptData(encryptedData, user.email);

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
          await deleteSecret(secretId);
        } catch (err) {
          console.error('Delete failed:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete secret');
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
  };

  return (
    <AppLayout
      title="PigeonHole Secrets"
      showSidebar
      showHeader
      showSearchBar
      onSearchClick={() => setShowSearchModal(true)}
      onSendClick={() => setShowSendModal(true)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            PigeonHole
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

        {/* Confirm Dialog */}
        <ConfirmDialog {...confirmDialogProps} />
      </Box>
    </AppLayout>
  );
};
