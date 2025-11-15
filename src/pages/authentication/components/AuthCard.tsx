import { ReactNode } from 'react';

// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard from '@/components/cards/MainCard';

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <MainCard
      sx={{
        maxWidth: { xs: 400, lg: 475 },
        margin: 'auto',
        backdrop: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 3,
        '& > *': { flexGrow: 1, flexBasis: '50%' }
      }}
      content={false}
      border={false}
      boxShadow
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shadow={(theme: any) => theme.customShadows.z1}
    >
      <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>{children}</Box>
    </MainCard>
  );
}
