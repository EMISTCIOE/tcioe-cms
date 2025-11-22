import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import Breadcrumbs from '@/components/@extended/Breadcrumbs';
import Loader from '@/components/Loader';
import navigation from '@/menu-items';
import Drawer from './Drawer';
import Header from './Header';

import { useGetMenuMaster, useMenuActions } from '@/api/menu';
import { MenuSearchProvider } from '@/contexts/search-context';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const { setDrawerOpen } = useMenuActions();
  const downXL = useMediaQuery((theme: any) => theme.breakpoints.down('xl'));

  useEffect(() => {
    setDrawerOpen(!downXL);
  }, [downXL, setDrawerOpen]);

  if (menuMasterLoading) return <Loader />;

  return (
    <MenuSearchProvider>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header />
        <Drawer />
        <Box
          component="main"
          sx={{
            width: { xs: '100%', lg: 'calc(100% - 260px)' },
            flexGrow: 1,
            p: { xs: 1.5, sm: 2.5, md: 3 },
            minHeight: '100vh',
            transition: (theme) => theme.transitions.create(['margin', 'width'])
          }}
        >
          <Toolbar />
          <Box sx={{ maxWidth: '1400px', margin: '0 auto', px: { xs: 0.5, sm: 0 } }}>
            <Breadcrumbs navigation={navigation} title />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </MenuSearchProvider>
  );
}
