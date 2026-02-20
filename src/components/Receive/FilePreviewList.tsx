import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { DecryptedFile } from '@/types/secret.types';
import { downloadFile, downloadAllAsZip } from '@/services/fileHandling/tarGz';

interface FilePreviewListProps {
  files: DecryptedFile[];
  onClose?: () => void;
}

/**
 * List of decrypted files with individual download buttons
 */
export const FilePreviewList: React.FC<FilePreviewListProps> = ({
  files,
  onClose,
}) => {
  const [downloadedFiles, setDownloadedFiles] = React.useState<Set<string>>(new Set());
  const [isDownloadingAll, setIsDownloadingAll] = React.useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownloadFile = (file: DecryptedFile) => {
    downloadFile(file);
    setDownloadedFiles((prev) => new Set(prev).add(file.name));
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      await downloadAllAsZip(files);
      files.forEach((file) => {
        setDownloadedFiles((prev) => new Set(prev).add(file.name));
      });
    } catch (error) {
      console.error('Failed to download all files:', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            Files Ephemerally Decrypted Successfully
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {files.length} file{files.length !== 1 ? 's' : ''} ({formatFileSize(totalSize)})
          </Typography>
        </Box>

        {files.length > 1 && (
          <Button
            variant="contained"
            startIcon={<DownloadForOfflineIcon />}
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
          >
            {isDownloadingAll ? 'Downloading...' : 'Download All'}
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <List>
        {files.map((file, index) => (
          <ListItem
            key={`${file.name}-${index}`}
            sx={{
              bgcolor: 'background.default',
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <InsertDriveFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={formatFileSize(file.size)}
                primaryTypographyProps={{
                  noWrap: true,
                }}
              />
            </Box>
            <IconButton
              onClick={() => handleDownloadFile(file)}
              color={downloadedFiles.has(file.name) ? 'success' : 'primary'}
              aria-label={`download ${file.name}`}
              sx={{ flexShrink: 0 }}
            >
              {downloadedFiles.has(file.name) ? <CheckCircleIcon /> : <DownloadIcon />}
            </IconButton>
          </ListItem>
        ))}
      </List>

      {onClose && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      )}
    </Paper>
  );
};
