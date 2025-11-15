import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

// project import
import { useAppSelector } from '@/libs/hooks';
import AuthWrapper from '../components/AuthWrapper';
import { authState } from '../redux/selector';
import AuthLogin from './AuthLogin';
import AuthVerificationEmailSentSuccess from './VerificationEmailSent';
import LogoMain from '@/components/logo/LogoMain';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const theme = useTheme();
  const { authVerificationEmailSent } = useAppSelector(authState);

  return (
    <React.Fragment>
      {!authVerificationEmailSent ? (
        <AuthWrapper>
          <Grid container spacing={3}>
            {/* College Branding Header */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <LogoMain />
                </Box>
                <Typography variant="h4" gutterBottom>
                  Thapathali Campus
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Content Management System
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Institute of Engineering, Tribhuvan University
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                <Typography variant="h3">Sign In</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enter your credentials to access the CMS dashboard
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <AuthLogin />
            </Grid>
          </Grid>
        </AuthWrapper>
      ) : (
        <AuthVerificationEmailSentSuccess />
      )}
    </React.Fragment>
  );
}
