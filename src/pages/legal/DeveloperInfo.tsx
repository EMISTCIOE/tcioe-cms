import { Avatar, Box, Container, Grid, IconButton, Link, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import Manish from '@/assets/images/users/manish.png';
import Bibek from '@/assets/images/users/bibek.png';
import MainCard from '@/components/cards/MainCard';

const developers = [
  {
    name: 'Manish Joshi',
    github: 'https://github.com/ManishJoc14',
    linkedin: 'https://www.linkedin.com/in/manish-joshi-dharmananda-9762b2304/',
    gmail: 'manishjoc14@gmail.com',
    department: 'Department of Electronics Engineering',
    photo: Manish
  },
  {
    name: 'Bibek Joshi',
    github: 'https://github.com/bibekjoshi01',
    linkedin: 'https://www.linkedin.com/in/bibek-joshi-69458b231/',
    gmail: 'bibekjoshi34@gmail.com',
    department: 'Department of Electronics Engineering',
    photo: Bibek
  }
];

const TeamSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          {developers.map((dev, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <MainCard
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 3,
                  p: 2
                }}
              >
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={dev.photo}
                    alt={dev.name}
                    sx={{
                      width: 100,
                      height: 100,
                      mr: 3,
                      borderRadius: 100
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight={600}>
                      {dev.name}
                    </Typography>
                    <Typography variant="body1" fontWeight={400} sx={{ mb: 2 }}>
                      {dev.department}
                    </Typography>
                    <Box>
                      <IconButton component={Link} href={dev.github} target="_blank" rel="noopener" color="inherit">
                        <GitHubIcon />
                      </IconButton>
                      <IconButton component={Link} href={dev.linkedin} target="_blank" rel="noopener" color="primary">
                        <LinkedInIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${dev.gmail}`}
                        target="_blank"
                        rel="noopener"
                        color="primary"
                      >
                        <EmailIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
