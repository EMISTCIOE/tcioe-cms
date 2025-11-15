import { ReactNode } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Logo from '@/components/logo';
import AuthCard from './AuthCard';

// assets
import AuthBackground from '@/assets/images/auth/AuthBackground';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <AuthBackground />
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          <AuthCard>{children}</AuthCard>
        </Grid>
      </Grid>
    </Box>
  );
}
