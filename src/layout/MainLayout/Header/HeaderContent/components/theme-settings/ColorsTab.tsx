import { useThemeMode } from '@/contexts/theme-context';
import { ColorValues } from '@/contexts/theme-context/types';
import { COLOR_SCHEMES } from '@/utils/constants/colors';
import { getFirstLetterCapital } from '@/utils/functions/getFirstLetterCapital';
import { CheckOutlined, PaletteOutlined } from '@mui/icons-material';
import {
  Box,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Popover,
  Switch,
  Tooltip,
  Typography,
  useTheme,
  Card,
  alpha,
  Divider
} from '@mui/material';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import ThemeModeChanger from './ThemeModeChanger';

// Define available color types
const COLOR_TYPES = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

export default function ColorsTab() {
  // Access theme mode and color customization functions from context
  const { mode, colorValues, updateColorValue } = useThemeMode();
  const theme = useTheme();

  // State to manage color picker popover
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [colorPickerType, setColorPickerType] = useState<keyof ColorValues>('primary');
  const [customizeAllColors, setCustomizeAllColors] = useState(false);

  // Function to update color value when a new color is picked
  const handleColorChange = (color: { hex: string }) => updateColorValue(colorPickerType, color.hex);

  // Interface for color picker event
  interface ShowColorPickerEvent {
    currentTarget: HTMLElement;
  }

  // Function to show color picker when a color box is clicked
  const showColorPicker = (event: ShowColorPickerEvent, type: keyof ColorValues) => {
    setColorPickerAnchor(event.currentTarget);
    setColorPickerType(type);
  };

  // Function to close color picker popover
  const closeColorPicker = () => setColorPickerAnchor(null);

  return (
    <Box>
      {/* Theme mode changer(Dark/Light) */}
      <ThemeModeChanger />

      {/* Toggle switch for advanced color customization */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}
      >
        <FormControlLabel
          control={<Switch checked={customizeAllColors} onChange={(e) => setCustomizeAllColors(e.target.checked)} color="primary" />}
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Advanced Customization
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Customize each color individually
              </Typography>
            </Box>
          }
          sx={{ m: 0, width: '100%' }}
        />
      </Card>

      {!customizeAllColors ? (
        <>
          {/* Simple primary color selection */}
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
            Primary Color
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '0.8125rem' }}>
            Choose your primary theme color
          </Typography>

          <Grid container spacing={1.5}>
            {COLOR_SCHEMES.map(({ name, [mode]: { main } }) => (
              <Grid item key={name}>
                <Tooltip title={name} placement="top">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: main,
                      cursor: 'pointer',
                      border: colorValues.primary.main === main ? '3px solid' : '2px solid',
                      borderColor: colorValues.primary.main === main ? 'primary.main' : alpha(theme.palette.divider, 0.3),
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 4px 12px ${alpha(main, 0.4)}`,
                        borderColor: 'primary.main'
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => updateColorValue('primary', main)}
                  >
                    {colorValues.primary.main === main && (
                      <CheckOutlined
                        sx={{
                          color: '#fff',
                          fontSize: 22,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              </Grid>
            ))}
            <Grid item>
              {/* Custom color picker button */}
              <Tooltip title="Custom Color" placement="top">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    border: '2px dashed',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  onClick={(e) => showColorPicker(e, 'primary')}
                >
                  <PaletteOutlined sx={{ fontSize: '1.3rem' }} />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          {/* Advanced color customization section */}
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
            Color Palette
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8125rem' }}>
            Fine-tune each color individually
          </Typography>

          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <List dense disablePadding>
              {COLOR_TYPES.map((type, index) => (
                <Box key={type}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.03)
                      }
                    }}
                  >
                    <ListItemText
                      primary={getFirstLetterCapital(type)}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    />
                    <Tooltip title="Click to customize" placement="left">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          bgcolor: colorValues[type as keyof ColorValues].main,
                          cursor: 'pointer',
                          ml: 1,
                          border: '2px solid',
                          borderColor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(colorValues[type as keyof ColorValues].main, 0.3)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            boxShadow: `0 4px 12px ${alpha(colorValues[type as keyof ColorValues].main, 0.5)}`
                          }
                        }}
                        onClick={(e) => showColorPicker(e, type as keyof ColorValues)}
                      />
                    </Tooltip>
                  </ListItem>
                  {index < COLOR_TYPES.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </>
      )}

      {/* Popover containing ChromePicker for custom color selection */}
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={closeColorPicker}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              boxShadow: theme.shadows[16],
              borderRadius: 2,
              overflow: 'hidden'
            }
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <ChromePicker color={colorValues[colorPickerType].main} onChange={handleColorChange} disableAlpha />
        </Box>
      </Popover>
    </Box>
  );
}
