import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface AppDialogProps {
  // Dialog props
  title?: string;
  contentText?: string | React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;

  // Control props
  open: boolean;
  initialOpen?: boolean;
  keepMounted?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

  // Callbacks
  onClose?: () => void;

  // Additional props
  transitionDirection?: 'up' | 'down' | 'left' | 'right';
}

export default function AppDialog({
  // Dialog props
  title = '',
  contentText = '',
  content = null,
  actions = null,

  // Control props
  open,
  keepMounted = true,
  fullWidth = false,
  maxWidth = 'lg',

  // Callbacks
  onClose = () => {},

  // Additional props
  transitionDirection = 'up'
}: AppDialogProps) {
  if (!open) return null;

  // Custom transition component based on the direction prop
  const CustomTransition = React.useCallback(
    React.forwardRef(function CustomTransition(
      props: TransitionProps & {
        children: React.ReactElement<any, any>;
      },
      ref: React.Ref<unknown>
    ) {
      return <Slide direction={transitionDirection} ref={ref} {...props} />;
    }),
    [transitionDirection]
  );

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={CustomTransition}
        keepMounted={keepMounted}
        fullScreen={fullWidth}
        fullWidth={maxWidth !== false}
        maxWidth={maxWidth}
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '90vh',
            height: fullWidth ? '100vh' : 'auto'
          }
        }}
      >
        {title && <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>}
        <DialogContent sx={{ pt: 2 }}>
          {contentText && <DialogContentText>{contentText}</DialogContentText>}
          {content}
        </DialogContent>
        {actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
      </Dialog>
    </React.Fragment>
  );
}
