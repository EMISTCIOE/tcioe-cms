import { ReactNode } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

export default function QuickStatsCard({ title, value, icon, color, subtitle }: QuickStatsCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 50,
              height: 50,
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
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
