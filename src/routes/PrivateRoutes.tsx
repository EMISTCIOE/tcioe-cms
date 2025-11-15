import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// project import
import Loadable from '@/components/Loadable';
import MainLayout from '@/layout/MainLayout';

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('@/pages/dashboard/index')));
const UnderConstruction = Loadable(lazy(() => import('@/pages/errors/UnderConstruction')));
const NotFoundPage = Loadable(lazy(() => import('@/pages/errors/PageNotFound')));
const Profile = Loadable(lazy(() => import('@/pages/account/profile')));
const ChangePassword = Loadable(lazy(() => import('@/pages/account/change-passwod')));
const Settings = Loadable(lazy(() => import('@/pages/account/settings')));
// User Setup Pages
const User = Loadable(lazy(() => import('@/pages/user')));
const UserRole = Loadable(lazy(() => import('@/pages/user-role')));
// Notice Pages
const Notice = Loadable(lazy(() => import('@/pages/notice')));

// Website Setup Pages
const AcademicCalendars = Loadable(lazy(() => import('@/pages/website-setup/academic-calendars')));
const CampusDownloads = Loadable(lazy(() => import('@/pages/website-setup/campus-downloads')));
const CampusFeedbacks = Loadable(lazy(() => import('@/pages/website-setup/campus-feedbacks')));
const CampusInfo = Loadable(lazy(() => import('@/pages/website-setup/campus-info')));
const CampusKeyOfficials = Loadable(lazy(() => import('@/pages/website-setup/campus-key-officials')));
const CampusReports = Loadable(lazy(() => import('@/pages/website-setup/campus-reports')));
const CampusUnions = Loadable(lazy(() => import('@/pages/website-setup/campus-unions')));
const GlobalGallery = Loadable(lazy(() => import('@/pages/website-setup/global-gallery')));
const GlobalEvents = Loadable(lazy(() => import('@/pages/website-setup/global-events')));
const CampusSections = Loadable(lazy(() => import('@/pages/website-setup/campus-sections')));
const CampusUnits = Loadable(lazy(() => import('@/pages/website-setup/campus-units')));
const Research = Loadable(lazy(() => import('@/pages/website-setup/research')));
const ResearchTags = Loadable(lazy(() => import('@/pages/website-setup/research/tags')));
const ResearchFacilities = Loadable(lazy(() => import('@/pages/website-setup/research-facilities')));
const Projects = Loadable(lazy(() => import('@/pages/website-setup/projects')));
const ProjectTags = Loadable(lazy(() => import('@/pages/website-setup/projects/tags')));

// Contact Setup Pages
const Contact = Loadable(lazy(() => import('@/pages/contact')));

// Student Clubs Setup Pages
const StudentClubs = Loadable(lazy(() => import('@/pages/student-clubs-setup/student-clubs')));
// ==============================|| PRIVATE ROUTES ||============================== //

const PrivateRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard/default" replace />} /> // Redirect to dashboard/default page
        <Route path="dashboard/default" element={<DashboardDefault />} />
        {/* Account Profile */}
        <Route path="account">
          <Route index element={<Navigate to="profile" replace />} /> // Redirect to personal page
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Notice */}
        <Route path="notice" element={<Notice />} />
        {/* User Setup */}
        <Route path="user-setup">
          <Route path="users" element={<User />} />
          <Route path="user-roles" element={<UserRole />} />
        </Route>
        <Route path="website-setup">
          <Route path="academic-calendars" element={<AcademicCalendars />} />
          <Route path="campus-downloads" element={<CampusDownloads />} />
          <Route path="campus-feedbacks" element={<CampusFeedbacks />} />
          <Route path="campus-info" element={<CampusInfo />} />
          <Route path="campus-key-officials" element={<CampusKeyOfficials />} />
          <Route path="campus-reports" element={<CampusReports />} />
          <Route path="campus-unions" element={<CampusUnions />} />
          <Route path="global-gallery" element={<GlobalGallery />} />
          <Route path="global-events" element={<GlobalEvents />} />
          <Route path="campus-sections" element={<CampusSections />} />
          <Route path="campus-units" element={<CampusUnits />} />
          <Route path="research" element={<Research />} />
          <Route path="research/tags" element={<ResearchTags />} />
          <Route path="research-facilities" element={<ResearchFacilities />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/tags" element={<ProjectTags />} />
        </Route>
        {/* Contact Setup */}
        <Route path="contact-setup">
          <Route path="phone-numbers" element={<Contact />} />
        </Route>
        {/* Student Clubs Setup */}
        <Route path="student-clubs-setup">
          <Route path="student-clubs" element={<StudentClubs />} />
        </Route>
      </Route>
      <Route path="app-settings" element={<UnderConstruction />} />
      <Route path="help" element={<UnderConstruction />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export default PrivateRoutes;
