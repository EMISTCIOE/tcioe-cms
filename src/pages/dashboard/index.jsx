// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// material-ui icons
import ScienceIcon from '@mui/icons-material/Science';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LanguageIcon from '@mui/icons-material/Language';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FeedbackIcon from '@mui/icons-material/Feedback';
import InfoIcon from '@mui/icons-material/Info';

// project imports
import ActionCard from './components/ActionCard';
import QuickStatsCard from './components/QuickStatsCard';
import WelcomeBanner from './components/WelcomeBanner';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  return (
    <Grid container rowSpacing={3} columnSpacing={2.75} sx={{ p: { xxs: 1, xs: 0 } }}>
      {/* Welcome Banner */}
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>

      {/* Quick Stats Row */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Quick Overview
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <QuickStatsCard title="Total Staff" value="—" icon={<PersonIcon sx={{ fontSize: 28 }} />} color="primary" subtitle="Active users" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <QuickStatsCard
          title="Active Notices"
          value="—"
          icon={<NotificationsActiveIcon sx={{ fontSize: 28 }} />}
          color="success"
          subtitle="Published"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <QuickStatsCard
          title="Research Papers"
          value="—"
          icon={<ScienceIcon sx={{ fontSize: 28 }} />}
          color="info"
          subtitle="Total publications"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <QuickStatsCard
          title="Student Clubs"
          value="—"
          icon={<Diversity3Icon sx={{ fontSize: 28 }} />}
          color="warning"
          subtitle="Active clubs"
        />
      </Grid>

      {/* Management Actions */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Content Management
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Manage Research"
          description="Add, edit, and organize research papers, publications, and facilities"
          icon={<ScienceIcon sx={{ fontSize: 32 }} />}
          color="primary"
          url="/website-setup/research"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Manage Notices"
          description="Publish announcements, notifications, and important updates"
          icon={<NotificationsActiveIcon sx={{ fontSize: 32 }} />}
          color="success"
          url="/notice-setup/notices"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Manage Projects"
          description="Showcase ongoing and completed campus projects"
          icon={<WorkIcon sx={{ fontSize: 32 }} />}
          color="info"
          url="/website-setup/projects"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Manage Staff"
          description="Add and update staff members, roles, and permissions"
          icon={<SupervisedUserCircleIcon sx={{ fontSize: 32 }} />}
          color="warning"
          url="/user-setup/users"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Campus Information"
          description="Update campus details, sections, and general information"
          icon={<LanguageIcon sx={{ fontSize: 32 }} />}
          color="error"
          url="/website-setup/campus-info"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ActionCard
          title="Student Clubs"
          description="Manage student clubs, events, and activities"
          icon={<Diversity3Icon sx={{ fontSize: 32 }} />}
          color="secondary"
          url="/student-clubs-setup/student-clubs"
        />
      </Grid>

      {/* Additional Quick Actions */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ActionCard
          title="Academic Calendar"
          description="Manage academic schedules"
          icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
          color="primary"
          url="/website-setup/academic-calendars"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ActionCard
          title="Downloads"
          description="Manage downloadable files"
          icon={<DownloadIcon sx={{ fontSize: 28 }} />}
          color="success"
          url="/website-setup/campus-downloads"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ActionCard
          title="Feedback"
          description="View campus feedback"
          icon={<FeedbackIcon sx={{ fontSize: 28 }} />}
          color="info"
          url="/website-setup/campus-feedbacks"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ActionCard
          title="Campus Reports"
          description="Manage official reports"
          icon={<ArticleIcon sx={{ fontSize: 28 }} />}
          color="warning"
          url="/website-setup/campus-reports"
        />
      </Grid>
    </Grid>
  );
}
