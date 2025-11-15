import { useState } from 'react';

// Mui imports
import { Box, Drawer, IconButton, Typography, useTheme, Backdrop } from '@mui/material';

import { CloseCircleOutlined } from '@ant-design/icons';
import { FormatColorFillOutlined, StyleOutlined, PaletteOutlined } from '@mui/icons-material';

// Project imports
import TABS from '@/components/CustomTab';
import { TabItem } from '@/menu-items/types';
import ColorsTab from './ColorsTab';
import ThemesTab from './ThemesTab';

const TabItems: TabItem[] = [
  {
    id: 'themes',
    title: 'Themes',
    icon: StyleOutlined,
    tabPanel: ThemesTab
  },
  {
    id: 'colors',
    title: 'Colors',
    icon: FormatColorFillOutlined,
    tabPanel: ColorsTab
  }
];

export default function ThemeSettings() {
  const theme = useTheme();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const toggleDrawer = () => setOpenDrawer((prev) => !prev);

  return (
    <>
      {/* Settings Trigger Button */}
      <Box sx={{ flexShrink: 0, ml: 0.5 }}>
        <IconButton
          onClick={toggleDrawer}
          title="Theme Settings"
          sx={{
            bgcolor: openDrawer ? 'action.hover' : 'transparent',
            mr: 0.25,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(90deg)',
              bgcolor: 'action.hover'
            }
          }}
        >
          <PaletteOutlined className="rotateIcon" />
        </IconButton>
      </Box>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        SlideProps={{
          timeout: 400
        }}
        PaperProps={{
          sx: {
            width: 360,
            bgcolor: 'background.default',
            boxShadow: theme.shadows[24],
            backgroundImage: 'none'
          }
        }}
        ModalProps={{
          BackdropComponent: Backdrop,
          BackdropProps: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }
          }
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <StyleOutlined sx={{ color: 'white', fontSize: '1.3rem' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="white" sx={{ letterSpacing: '-0.5px' }}>
                  Theme Studio
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.75rem' }}>
                  Customize your experience
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={toggleDrawer}
              size="small"
              sx={{
                borderRadius: '8px',
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'white',
                  color: 'primary.main',
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <CloseCircleOutlined style={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <TABS variant="fullWidth" handleChange={handleTabChange} value={activeTab} tabItems={TabItems} />
        </Box>
      </Drawer>
    </>
  );
}
