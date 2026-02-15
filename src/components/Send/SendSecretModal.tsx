import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Box, Divider, Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileDropzone } from './FileDropzone';
import { RecipientInput } from './RecipientInput';
import { SecretOptionsPanel } from './SecretOptionsPanel';
import { DualProgressIndicator } from './DualProgressIndicator';
import { SendSecretButton } from './SendSecretButton';
import { useCrypto } from '@/hooks/useCrypto';
import { useRecipientSearch } from '@/hooks/useRecipientSearch';
import { createSecret, uploadToS3 } from '@/services/api/secret.api';
import { generateRandomPet } from '@/utils/randomPet';
import type { FileWithPreview, Recipient, ExpirationPreset } from '@/types/secret.types';
import { EXPIRATION_PRESETS } from '@/types/secret.types';
import type { User } from '@/types/api.types';

interface SendSecretModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal dialog for sending secrets
 */
export const SendSecretModal: React.FC<SendSecretModalProps> = ({
  open,
  onClose,
}) => {
  const { encryptFiles, encryptionProgress } = useCrypto();
  const { searchUser } = useRecipientSearch();

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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setRecipients([]);
      setRecipientUsers([]);
      setReference('');
      setOnetime(false);
      setExpiration('28days');
      setShowProgress(false);
      setIsComplete(false);
      setError(null);
      setShowSuccess(false);
    }
  }, [open]);

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
    return generateRandomPet();
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

      // Close modal and reset form after brief delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Send failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to send secret');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          overflow: 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        Send a Secret
        <CloseIcon
          sx={{
            cursor: 'pointer',
            opacity: 0.7,
            '&:hover': { opacity: 1 },
          }}
          onClick={onClose}
        />
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
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
      </DialogContent>
    </Dialog>
  );
};
