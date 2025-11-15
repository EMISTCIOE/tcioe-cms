import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  url: string;
  count?: number;
}

export default function ActionCard({ title, description, icon, color, url, count }: ActionCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
      onClick={() => navigate(url)}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.lighter`,
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          {count !== undefined && (
            <Typography variant="h3" color={`${color}.main`}>
              {count}
            </Typography>
          )}
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              alignSelf: 'flex-start',
              color: `${color}.main`,
              '&:hover': {
                bgcolor: `${color}.lighter`
              }
            }}
          >
            Manage
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
