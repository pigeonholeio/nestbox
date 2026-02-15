import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { Secret } from '@/types/api.types';
import { SecretCard } from './SecretCard';

interface SearchSecretModalProps {
  open: boolean;
  onClose: () => void;
  secrets: Secret[];
  onDownload: (secretId: string) => void;
  onDelete: (secretId: string) => void;
  downloadingSecretId?: string | null;
}

export const SearchSecretModal: React.FC<SearchSecretModalProps> = ({
  open,
  onClose,
  secrets,
  onDownload,
  onDelete,
  downloadingSecretId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSecrets = secrets.filter((secret) => {
    const query = searchQuery.toLowerCase();
    return (
      secret.reference?.toLowerCase().includes(query) ||
      secret.sender?.toLowerCase().includes(query) ||
      secret.sender_email?.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Search Secrets</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 3, mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Search by reference, sender name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            autoFocus
          />
        </Box>

        {filteredSecrets.length === 0 && searchQuery && (
          <Alert severity="info">No secrets match your search</Alert>
        )}

        {filteredSecrets.length === 0 && !searchQuery && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            Start typing to search...
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: { xs: 300, sm: 400 }, overflowY: 'auto' }}>
          {filteredSecrets.map((secret) => (
            <Box key={secret.reference || Math.random()}>
              <SecretCard
                secret={secret}
                onDownload={onDownload}
                onDelete={onDelete}
                isDownloading={downloadingSecretId === secret.id}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
