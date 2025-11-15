// MUI imports
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Typography, alpha } from '@mui/material';

// Project imports
import { useThemeMode } from '@/contexts/theme-context';

export default function ThemeModeChanger() {
  const { mode, toggleThemeMode } = useThemeMode();

  return (
    <Box
      sx={{
        mb: 3,
        pb: 3,
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        gutterBottom
        sx={{
          mb: 1.5,
          color: 'text.primary',
          fontSize: '0.875rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}
      >
        Appearance
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={toggleThemeMode}
        fullWidth
        sx={{
          bgcolor: (theme) => alpha(theme.palette.divider, 0.05),
          p: 0.5,
          borderRadius: 2,
          border: 'none',
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: '8px !important',
            mx: 0.25,
            '&:not(:first-of-type)': {
              borderLeft: 0
            }
          }
        }}
      >
        <ToggleButton
          value="light"
          sx={{
            py: 1.25,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            border: 'none',
            color: mode === 'light' ? 'primary.main' : 'text.secondary',
            bgcolor: mode === 'light' ? 'background.paper' : 'transparent',
            boxShadow: mode === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            '&:hover': {
              bgcolor: mode === 'light' ? 'background.paper' : alpha('#000', 0.03)
            },
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'background.paper'
              }
            }
          }}
        >
          <LightModeOutlined sx={{ mr: 1, fontSize: '1.1rem' }} />
          Light
        </ToggleButton>

        <ToggleButton
          value="dark"
          sx={{
            py: 1.25,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            border: 'none',
            color: mode === 'dark' ? 'primary.main' : 'text.secondary',
            bgcolor: mode === 'dark' ? 'background.paper' : 'transparent',
            boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            '&:hover': {
              bgcolor: mode === 'dark' ? 'background.paper' : alpha('#000', 0.03)
            },
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'background.paper'
              }
            }
          }}
        >
          <DarkModeOutlined sx={{ mr: 1, fontSize: '1.1rem' }} />
          Dark
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
