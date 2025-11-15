// material-ui
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import MobileSection from './components/MobileSection';

import Profile from './components/profile';

import FullScreenButton from './components/FullScreen';
import ThemeSettings from './components/theme-settings';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {!downLG && <Box sx={{ width: '100%' }} />} {/* Spacer */}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <FullScreenButton />
      <ThemeSettings />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
