import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { FileWithPreview } from '@/types/secret.types';

interface FileDropzoneProps {
  files: FileWithPreview[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
  maxFiles?: number;
  disabled?: boolean;
}

/**
 * File upload dropzone with drag-and-drop support
 */
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  files,
  onFilesAdded,
  onFileRemoved,
  maxFiles = 10,
  disabled = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || files.length >= maxFiles,
    multiple: true,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: { xs: 2, sm: 4 },
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: disabled || files.length >= maxFiles ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          opacity: disabled || files.length >= maxFiles ? 0.6 : 1,
          '&:hover': {
            borderColor: disabled || files.length >= maxFiles ? 'divider' : 'primary.main',
            bgcolor: disabled || files.length >= maxFiles ? 'background.paper' : 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse
        </Typography>
        {files.length >= maxFiles && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            Maximum {maxFiles} files allowed
          </Typography>
        )}
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Selected Files ({files.length})
            </Typography>
            <Chip
              label={`Total: ${formatFileSize(totalSize)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <List>
            {files.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  bgcolor: 'background.paper',
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
                  <InsertDriveFileIcon sx={{ mr: 2, color: 'text.secondary', flexShrink: 0 }} />
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{
                      noWrap: true,
                    }}
                  />
                </Box>
                <IconButton
                  aria-label="delete"
                  onClick={() => onFileRemoved(file.id)}
                  disabled={disabled}
                  size="small"
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
