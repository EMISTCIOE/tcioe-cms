import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Project Imports
import FormSection from '@/components/app-form/FormSection';
import { useLogin } from '../hooks/useLogin';
import { LoginFormDataType } from '../redux/types';
import { loginFields } from './login.config';

// Cloudflare Turnstile Component (optional - requires package installation)
const TurnstileWidget = () => {
  const turnstileRef = React.useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string>('');

  React.useEffect(() => {
    // Only load Turnstile if VITE_TURNSTILE_SITE_KEY is set
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    if (!siteKey || !turnstileRef.current) return;

    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => {
            setTurnstileToken(token);
          }
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Only show Turnstile if site key is configured
  if (!import.meta.env.VITE_TURNSTILE_SITE_KEY) {
    return null;
  }

  return <div ref={turnstileRef} />;
};

export default function AuthLogin() {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState({
    password: false
  });

  const handleClickShowPassword = () => setShowPassword((prev) => ({ password: !prev.password }));

  const { handleSubmit, onSubmit, loadingLogin, control, errors } = useLogin();

  const isTurnstileEnabled = !!import.meta.env.VITE_TURNSTILE_SITE_KEY;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormSection<LoginFormDataType>
            fields={loginFields}
            control={control}
            errors={errors}
            showPassword={showPassword}
            handleToggleVisibility={handleClickShowPassword}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: -1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="h6">Keep me signed in</Typography>}
            />
            <Link to={'/forget-password'} variant="h6" component={RouterLink} color="primary">
              Forgot Password?
            </Link>
          </Stack>
        </Grid>

        {/* Cloudflare Turnstile */}
        {isTurnstileEnabled && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TurnstileWidget />
            </Box>
          </Grid>
        )}

        {/* Security Notice */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
            This is a secure login page. Your credentials are encrypted and protected.
            {isTurnstileEnabled && ' Additional bot protection is enabled.'}
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Button disableElevation disabled={loadingLogin} fullWidth size="large" type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
