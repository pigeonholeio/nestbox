import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import { SecretCard } from './SecretCard';
import type { Secret } from '@/types/api.types';

interface SecretsListProps {
  secrets: Secret[];
  onDownload: (secretId: string) => void;
  onDelete: (secretId: string) => void;
  downloadingSecretId: string | null;
}

type FilterType = 'all' | 'unread' | 'expiring';

/**
 * List/grid view of received secrets with filtering
 */
export const SecretsList: React.FC<SecretsListProps> = ({
  secrets,
  onDownload,
  onDelete,
  downloadingSecretId,
}) => {
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSecrets = React.useMemo(() => {
    let filtered = [...secrets];

    // Apply filter
    if (filter === 'unread') {
      filtered = filtered.filter((s) => !s.downloaded);
    } else if (filter === 'expiring') {
      filtered = filtered.filter((s) => {
        if (!s.expiration) return false;
        const expirationDate = new Date(s.expiration);
        const hoursUntilExpiration =
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilExpiration < 24 && hoursUntilExpiration > 0;
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.sender_email.toLowerCase().includes(query) ||
          s.reference.toLowerCase().includes(query)
      );
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [secrets, filter, searchQuery]);

  if (secrets.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <InboxIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No secrets received yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Secrets sent to you will appear here
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by sender or reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
          size="small"
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <MenuItem value="all">All Secrets</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="expiring">Expiring Soon</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredSecrets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No secrets match your filters
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredSecrets.length} of {secrets.length} secrets
          </Typography>

          <Grid container spacing={3}>
            {filteredSecrets.map((secret) => (
              <Grid key={secret.reference} size={{ xs: 12, sm: 12, md: 6 }}>
                <SecretCard
                  secret={secret}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  isDownloading={downloadingSecretId === secret.id}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};
