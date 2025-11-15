// material-ui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ==============================|| AUTH BACKGROUND ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
        top: 0,
        left: 0,
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
      }}
    />
  );
}
