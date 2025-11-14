import React from 'react';
import { Box, Typography, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

const EditorContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  minHeight: 200,
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2
  }
}));

const EditorToolbar = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap'
}));

const EditorContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 150,
  outline: 'none',
  '& p': {
    margin: 0,
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    }
  },
  '& ul, & ol': {
    marginLeft: theme.spacing(2)
  }
}));

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Start typing...',
  error = false,
  helperText
}) => {
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}

      <EditorContainer sx={{ borderColor: error ? 'error.main' : 'divider' }}>
        <EditorContent
          contentEditable
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleContentChange}
          data-placeholder={!value ? placeholder : ''}
          suppressContentEditableWarning
          style={{
            color: error ? '#d32f2f' : 'inherit'
          }}
        />
      </EditorContainer>

      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};
