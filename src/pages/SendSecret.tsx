import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, Snackbar, Divider } from '@mui/material';
import { AppLayout } from '@/components/Layout/AppLayout';
import { FileDropzone } from '@/components/Send/FileDropzone';
import { RecipientInput } from '@/components/Send/RecipientInput';
import { SecretOptionsPanel } from '@/components/Send/SecretOptionsPanel';
import { DualProgressIndicator } from '@/components/Send/DualProgressIndicator';
import { SendSecretButton } from '@/components/Send/SendSecretButton';
import { SearchSecretModal } from '@/components/Receive/SearchSecretModal';
import { usePigeonHoleAuth } from '@/hooks/usePigeonHoleAuth';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { useCrypto } from '@/hooks/useCrypto';
import { useRecipientSearch } from '@/hooks/useRecipientSearch';
import { useSecrets } from '@/hooks/useSecrets';
import { createSecret, uploadToS3, downloadSecret } from '@/services/api/secret.api';
import type { FileWithPreview, Recipient, ExpirationPreset } from '@/types/secret.types';
import { EXPIRATION_PRESETS } from '@/types/secret.types';
import type { User } from '@/types/api.types';

/**
 * Main secret sending page
 */
export const SendSecret: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = usePigeonHoleAuth();
  const { checkHasKey } = useKeyManagement();
  const { encryptFiles, encryptionProgress } = useCrypto();
  const { searchUser } = useRecipientSearch();
  const { secrets, deleteSecret } = useSecrets(true);
  const { decryptData } = useCrypto();

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientUsers, setRecipientUsers] = useState<User[]>([]);
  const [expiration, setExpiration] = useState<ExpirationPreset>('28days');
  const [onetime, setOnetime] = useState(false);
  const [reference, setReference] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ stage: 'Ready', percent: 0 });
  const [showProgress, setShowProgress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Check for key on mount
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      if (!checkHasKey(user.email)) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, user?.email, checkHasKey, navigate]);

  // Handle file addition
  const handleFilesAdded = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.id = `${file.name}-${Date.now()}-${Math.random()}`;
      return fileWithPreview;
    });
    setFiles([...files, ...filesWithPreview]);
  };

  // Handle file removal
  const handleFileRemoved = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  // Handle recipient search
  const handleSearchUser = async (email: string, useTransient: boolean): Promise<User | null> => {
    const user = await searchUser(email, useTransient);

    if (user) {
      // Store the user for later use
      setRecipientUsers((prev) => {
        const exists = prev.some((u) => u.id === user.id);
        return exists ? prev : [...prev, user];
      });
    }

    return user;
  };

  // Calculate expiration date
  const getExpirationDate = (): string | undefined => {
    if (expiration === 'never') return undefined;

    const hours = EXPIRATION_PRESETS[expiration].hours;
    if (!hours) return undefined;

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hours);
    return expirationDate.toISOString();
  };

  // Generate reference if not provided
  const getReference = (): string => {
    if (reference.trim()) return reference.trim();

    const timestamp = new Date().toISOString().split('T')[0];
    const fileNames = files.slice(0, 2).map(f => f.name).join(', ');
    return `${fileNames} - ${timestamp}`;
  };

  // Handle send
  const handleSend = async () => {
    if (files.length === 0 || recipients.length === 0) return;

    setIsSending(true);
    setShowProgress(true);
    setError(null);
    setIsComplete(false);
    setUploadProgress({ stage: 'Waiting...', percent: 0 });

    try {
      // Get the User objects for recipients
      const users = recipientUsers.filter((u) =>
        recipients.some((r) => r.user_id === u.id)
      );

      if (users.length !== recipients.length) {
        throw new Error('Some recipient users not found');
      }

      // Step 1: Encrypt files
      const encryptedData = await encryptFiles(files, users);

      // Step 2: Create secret envelope
      setUploadProgress({ stage: 'Creating secret...', percent: 0 });

      const secretResponse = await createSecret(
        users.map((u) => u.id),
        getReference(),
        {
          ephemeralkeys: recipients.some((r) => r.isTransient),
          onetime,
          expiration: getExpirationDate(),
        }
      );

      // Step 3: Upload to S3
      setUploadProgress({ stage: 'Uploading...', percent: 0 });

      await uploadToS3(
        secretResponse.s3_info.url,
        secretResponse.s3_info.fields,
        encryptedData,
        (percent) => {
          setUploadProgress({ stage: 'Uploading...', percent });
        }
      );

      setUploadProgress({ stage: 'Complete!', percent: 100 });
      setIsComplete(true);
      setShowSuccess(true);

      // Reset form after brief delay
      setTimeout(() => {
        setFiles([]);
        setRecipients([]);
        setRecipientUsers([]);
        setReference('');
        setOnetime(false);
        setExpiration('28days');
        setShowProgress(false);
        setIsComplete(false);
      }, 3000);
    } catch (err) {
      console.error('Send failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to send secret');
    } finally {
      setIsSending(false);
    }
  };

  // Handle download from search modal
  const handleDownload = async (secretId: string) => {
    if (!user?.email) return;

    try {
      const encryptedData = await downloadSecret(secretId);
      const files = await decryptData(encryptedData, user.email);
      // Files would be displayed in a modal in a real scenario
      console.log('Downloaded files:', files);
    } catch (err) {
      console.error('Download/decrypt failed:', err);
    }
  };

  return (
    <AppLayout
      title="Send Secret"
      showSidebar
      showHeader
      showSearchBar={true}
      onSearchClick={() => setShowSearchModal(true)}
    >
      <Box>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Send a Secret
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Securely share encrypted files with anyone. All encryption happens in your browser.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {showProgress ? (
          <DualProgressIndicator
            encryptionProgress={encryptionProgress}
            uploadProgress={uploadProgress}
            isComplete={isComplete}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FileDropzone
              files={files}
              onFilesAdded={handleFilesAdded}
              onFileRemoved={handleFileRemoved}
              disabled={isSending}
            />

            <RecipientInput
              recipients={recipients}
              onRecipientsChange={setRecipients}
              onSearchUser={handleSearchUser}
              disabled={isSending}
            />

            <SecretOptionsPanel
              expiration={expiration}
              onExpirationChange={setExpiration}
              onetime={onetime}
              onOnetimeChange={setOnetime}
              disabled={isSending}
            />

            <SendSecretButton
              files={files}
              recipients={recipients}
              onSend={handleSend}
              isSending={isSending}
            />
          </Box>
        )}

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          message="Secret sent successfully! Your recipients have been notified."
        />

        {/* Search Modal */}
        <SearchSecretModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          secrets={secrets}
          onDownload={handleDownload}
          onDelete={deleteSecret}
          downloadingSecretId={null}
        />
      </Box>
    </AppLayout>
  );
};
