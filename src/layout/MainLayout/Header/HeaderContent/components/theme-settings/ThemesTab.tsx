// MUI Imports
import { Box, Card, CardActionArea, Grid, Tooltip, Typography, alpha, Chip } from '@mui/material';

// Project Imports
import { useThemeMode } from '@/contexts/theme-context';
import { THEME_PRESETS } from '@/utils/constants/colors';
import ThemeModeChanger from './ThemeModeChanger';
import { CheckCircleRounded } from '@mui/icons-material';

// ==============================|| Themes TAB ||============================== //

export default function ThemesTab() {
  const { mode, selectedTheme, selectTheme } = useThemeMode();

  const handleThemeSelect = (themeIndex: number) => {
    selectTheme(themeIndex);
  };

  return (
    <Box>
      {/* Theme mode changer(Dark/Light) */}
      <ThemeModeChanger />

      <Typography
        variant="subtitle2"
        fontWeight={600}
        gutterBottom
        sx={{
          mb: 0.5,
          color: 'text.primary',
          fontSize: '0.875rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}
      >
        Theme Presets
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '0.8125rem' }}>
        Select a predefined theme with harmonized colors
      </Typography>

      <Grid container spacing={2}>
        {THEME_PRESETS.map((preset, index) => (
          <Grid item xs={6} key={preset.name}>
            <Card
              elevation={selectedTheme === index ? 4 : 0}
              sx={{
                position: 'relative',
                border: selectedTheme === index ? '2px solid' : '1px solid',
                borderColor: selectedTheme === index ? 'primary.main' : 'divider',
                borderRadius: 2,
                overflow: 'visible',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: selectedTheme === index ? alpha('#000', 0.02) : 'background.paper',
                transform: selectedTheme === index ? 'scale(1.02)' : 'scale(1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: selectedTheme === index ? 4 : 2,
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardActionArea
                onClick={() => handleThemeSelect(index)}
                sx={{
                  p: 2,
                  position: 'relative'
                }}
              >
                {/* Selected Badge */}
                {selectedTheme === index && (
                  <Chip
                    icon={<CheckCircleRounded sx={{ fontSize: '1rem' }} />}
                    label="Active"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      zIndex: 1,
                      '& .MuiChip-icon': {
                        ml: 0.5
                      }
                    }}
                  />
                )}

                {/* Theme Name */}
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    mb: 1.5,
                    color: selectedTheme === index ? 'primary.main' : 'text.primary',
                    fontSize: '0.875rem'
                  }}
                >
                  {preset.name}
                </Typography>

                {/* Color Palette Preview */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.75,
                    flexWrap: 'wrap'
                  }}
                >
                  {Object.values(preset[mode]).map((colorValues, i) => (
                    <Tooltip title={colorValues.main} key={colorValues.main + i} placement="top">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: colorValues.main,
                          borderRadius: '6px',
                          flexShrink: 0,
                          border: '2px solid',
                          borderColor: 'background.paper',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.3)',
                            zIndex: 10
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
