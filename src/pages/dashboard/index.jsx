import { useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
import { useGetDashboardStatsQuery } from './api/dashboard.api';
import DashboardCharts from './components/DashboardCharts';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery({});
  const { roleType } = useAppSelector(authState);

  const stats = useMemo(() => {
    if (!statsResponse?.data) {
      return undefined;
    }

    const { pending_items: pendingItems, chart_data: chartData, ...rest } = statsResponse.data;

    return {
      ...rest,
      pendingItems,
      chartData
    };
  }, [statsResponse?.data]);
  const isUnionUser = roleType === 'UNION';

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load dashboard statistics. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75} sx={{ p: { xxs: 1, xs: 0 } }}>
      {/* Welcome Banner */}
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>

      {/* Quick Stats Row */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isUnionUser ? 'My Union Overview' : 'Pending Items & Actions'}
        </Typography>
      </Grid>
      {!isUnionUser && (
        <>
          <Grid item xs={12} sm={6} md={2.4}>
            <QuickStatsCard
              title="Pending Notices"
              value={stats?.pendingItems?.notices?.toString() || '0'}
              icon={<NotificationsActiveIcon sx={{ fontSize: 28 }} />}
              color="warning"
              subtitle="Draft notices"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <QuickStatsCard
              title="Pending Research"
              value={stats?.pendingItems?.research?.toString() || '0'}
              icon={<ScienceIcon sx={{ fontSize: 28 }} />}
              color="info"
              subtitle="Under review"
            />
          </Grid>
        </>
      )}
      <Grid item xs={12} sm={6} md={isUnionUser ? 4 : 2.4}>
        <QuickStatsCard
          title={isUnionUser ? 'My Events' : 'Pending Events'}
          value={stats?.pendingItems?.events?.toString() || '0'}
          icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
          color="primary"
          subtitle={isUnionUser ? 'Union events' : 'Upcoming events'}
        />
      </Grid>
      {!isUnionUser && (
        <>
          <Grid item xs={12} sm={6} md={2.4}>
            <QuickStatsCard
              title="Pending Projects"
              value={stats?.pendingItems?.projects?.toString() || '0'}
              icon={<WorkIcon sx={{ fontSize: 28 }} />}
              color="secondary"
              subtitle="In progress"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <QuickStatsCard
              title="Unresolved Feedback"
              value={stats?.pendingItems?.feedback?.toString() || '0'}
              icon={<FeedbackIcon sx={{ fontSize: 28 }} />}
              color="error"
              subtitle="Needs attention"
            />
          </Grid>
        </>
      )}
      {isUnionUser && (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <QuickStatsCard
              title="Union Members"
              value={stats?.pendingItems?.members?.toString() || '0'}
              icon={<PersonIcon sx={{ fontSize: 28 }} />}
              color="info"
              subtitle="Total members"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickStatsCard
              title="Gallery Images"
              value={stats?.pendingItems?.gallery?.toString() || '0'}
              icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
              color="secondary"
              subtitle="Total uploads"
            />
          </Grid>
        </>
      )}

      {/* Charts Section */}
      {!isUnionUser && stats?.chartData && (
        <Grid item xs={12} sx={{ mt: 2 }}>
          <DashboardCharts chartData={stats.chartData} />
        </Grid>
      )}

      {/* Management Actions */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isUnionUser ? 'Union Management' : 'Content Management'}
        </Typography>
      </Grid>

      {isUnionUser ? (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <ActionCard
              title="Union Members"
              description="Manage your union members and their details"
              icon={<PersonIcon sx={{ fontSize: 32 }} />}
              color="primary"
              url="/website-setup/union-members"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <ActionCard
              title="Union Events"
              description="Create and manage events for your union"
              icon={<CalendarMonthIcon sx={{ fontSize: 32 }} />}
              color="success"
              url="/website-setup/global-events"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <ActionCard
              title="Union Gallery"
              description="Upload and manage gallery images for your union"
              icon={<InfoIcon sx={{ fontSize: 32 }} />}
              color="info"
              url="/website-setup/global-gallery"
            />
          </Grid>
        </>
      ) : (
        <>
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
              url="/notice"
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
        </>
      )}

      {/* Additional Quick Actions */}
      {!isUnionUser && (
        <>
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
        </>
      )}
    </Grid>
  );
}
