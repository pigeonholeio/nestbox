import React, { useMemo, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { UserKey } from '@/types/api.types';
import { KeyCard } from './KeyCard';

interface KeysListProps {
  keys: UserKey[];
  onDelete: (keyId: string) => void;
  isDeletingKeyId?: string | null;
  isLoading?: boolean;
}

/**
 * List of user's public keys with filtering and management
 */
export const KeysList: React.FC<KeysListProps> = ({
  keys,
  onDelete,
  isDeletingKeyId,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'ephemeral' | 'permanent'>('all');

  const filteredKeys = useMemo(() => {
    let result = keys;

    // Filter by type
    if (filterTab === 'ephemeral') {
      result = result.filter((k) => k.reference?.includes('ephemeral'));
    } else if (filterTab === 'permanent') {
      result = result.filter((k) => !k.reference?.includes('ephemeral'));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (k) =>
          k.reference?.toLowerCase().includes(query) ||
          k.thumbprint.toLowerCase().includes(query)
      );
    }

    return result;
  }, [keys, searchQuery, filterTab]);

  if (isLoading && keys.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (keys.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No keys yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your public keys will appear here once you create them
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FilterListIcon color="action" />
        <Tabs
          value={filterTab}
          onChange={(_, value) => setFilterTab(value)}
          sx={{ flex: 1 }}
        >
          <Tab label={`All (${keys.length})`} value="all" />
          <Tab
            label={`Ephemeral (${keys.filter((k) => k.reference?.includes('ephemeral')).length})`}
            value="ephemeral"
          />
          <Tab
            label={`Permanent (${keys.filter((k) => !k.reference?.includes('ephemeral')).length})`}
            value="permanent"
          />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by reference or thumbprint..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
      />

      {filteredKeys.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No keys match your search
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {filteredKeys.map((key) => (
            <KeyCard
              key={key.id}
              userKey={key}
              onDelete={onDelete}
              isDeleting={isDeletingKeyId === key.id}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
