import React, { useRef } from 'react';
import { Box, Button, Typography, FormHelperText, IconButton, Card, CardContent } from '@mui/material';
import { CloudUpload, Delete, InsertDriveFile } from '@mui/icons-material';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onChange: (file: File | File[] | null) => void;
  value?: File | File[] | null;
  existingFileName?: string;
  existingFileUrl?: string;
  existingFileHint?: string;
  error?: boolean;
  helperText?: string;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  onChange,
  value,
  existingFileName,
  existingFileUrl,
  existingFileHint = 'Existing file will be kept unless you upload a new one.',
  error = false,
  helperText,
  maxSize = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      onChange(null);
      return;
    }

    // Check file size
    const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      alert(`File size should not exceed ${maxSize}MB`);
      return;
    }

    if (multiple) {
      onChange(Array.from(files));
    } else {
      onChange(files[0]);
    }
  };

  const handleRemoveFile = (indexToRemove?: number) => {
    if (multiple && Array.isArray(value) && typeof indexToRemove === 'number') {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFiles = () => {
    if (!value) return null;

    const files = Array.isArray(value) ? value : [value];

    return (
      <Box sx={{ mt: 2 }}>
        {files.map((file, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 1 }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile color="primary" />
                  <Box>
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" color="error" onClick={() => handleRemoveFile(multiple ? index : undefined)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}

      <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileSelect} style={{ display: 'none' }} />

      {!value && existingFileName && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <InsertDriveFile color="action" />
                <Box>
                  <Typography variant="body2" noWrap title={existingFileName}>
                    {existingFileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {existingFileHint}
                  </Typography>
                </Box>
              </Box>
              {existingFileUrl && (
                <Button variant="text" size="small" href={existingFileUrl} target="_blank" rel="noopener noreferrer">
                  Open
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box
        sx={{
          border: '2px dashed',
          borderColor: error ? 'error.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: error ? 'error.dark' : 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
        onClick={handleButtonClick}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          Drop files here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && ` • Max size: ${maxSize}MB`}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={(event) => {
            event.stopPropagation();
            handleButtonClick();
          }}
        >
          Choose Files
        </Button>
      </Box>

      {renderFiles()}

      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileUpload;
