import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import config from '@/config';
import Logo from './LogoMain';

// ==============================|| MAIN LOGO - TCIOE ||============================== //

const LogoSection = ({ sx, to }) => {
  // Check if this is being used in the drawer (small size)
  const isSmall = sx?.width && (sx.width === 35 || sx.width === 'auto');

  return (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
      {isSmall ? (
        // Just show logo when drawer is collapsed
        <Logo />
      ) : (
        // Show full branding when drawer is open or in header
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Logo />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'text.primary'
              }}
            >
              Thapathali Campus
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                lineHeight: 1
              }}
            >
              Content Management System
            </Typography>
          </Box>
          <Chip
            label={import.meta.env.VITE_APP_VERSION}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{ mt: 0.5, ml: 1, fontSize: '0.725rem', height: 20, '& .MuiChip-label': { px: 0.5 } }}
          />
        </Stack>
      )}
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
