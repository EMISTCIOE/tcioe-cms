// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';

// project imports
import { useAppSelector } from '@/libs/hooks';

export default function WelcomeBanner() {
  const theme = useTheme();
  const authState = useAppSelector((state) => state.auth);

  // Get the first name from fullName or use fullName if no space
  const getUserName = () => {
    if (!authState.fullName) return 'Admin';
    const names = authState.fullName.trim().split(' ');
    return names[0] || authState.fullName;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h3" color="inherit">
            {getGreeting()}, {getUserName()}!
          </Typography>
          <Typography variant="h6" color="inherit" sx={{ opacity: 0.9 }}>
            Welcome to Thapathali Campus CMS
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
            Manage your college content, notices, research, and more from this dashboard.
          </Typography>
        </Stack>
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.15,
            fontSize: '200px',
            transform: 'rotate(15deg)'
          }}
        >
          <SchoolIcon sx={{ fontSize: 'inherit' }} />
        </Box>
      </CardContent>
    </Card>
  );
}
