import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// project import
import Loadable from '@/components/Loadable';
import MainLayout from '@/layout/MainLayout';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

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
const Departments = Loadable(lazy(() => import('@/pages/website-setup/departments')));
const Research = Loadable(lazy(() => import('@/pages/website-setup/research')));
const ResearchTags = Loadable(lazy(() => import('@/pages/website-setup/research/tags')));
const ResearchFacilities = Loadable(lazy(() => import('@/pages/website-setup/research-facilities')));
const Projects = Loadable(lazy(() => import('@/pages/website-setup/projects')));
const ProjectTags = Loadable(lazy(() => import('@/pages/website-setup/projects/tags')));
const Academic = Loadable(lazy(() => import('@/pages/website-setup/academic')));
const ManageEmis = Loadable(lazy(() => import('@/pages/website-setup/emis-management')));
const EmisHardware = Loadable(lazy(() => import('@/pages/website-setup/emis-management/hardware')));
const EmisVps = Loadable(lazy(() => import('@/pages/website-setup/emis-management/vps')));
const EmisEmailReset = Loadable(lazy(() => import('@/pages/website-setup/emis-management/email-reset')));
const UnionMembers = Loadable(lazy(() => import('@/pages/website-setup/union-members')));

// Contact Setup Pages
const Contact = Loadable(lazy(() => import('@/pages/contact')));

// Student Clubs Setup Pages
const StudentClubs = Loadable(lazy(() => import('@/pages/student-clubs-setup/student-clubs')));

// My Unit Page
const MyUnit = Loadable(lazy(() => import('@/pages/my-unit')));
// ==============================|| PRIVATE ROUTES ||============================== //

const PrivateRoutes = () => {
  const { roleType } = useAppSelector(authState);
  const isEmisStaff = roleType === 'EMIS-STAFF';
  const isAdmin = roleType === 'ADMIN';
  const isUnion = roleType === 'UNION';
  const isUnit = roleType === 'CAMPUS-UNIT';
  const isSection = roleType === 'CAMPUS-SECTION';

  return (
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
          {/* My Unit - For Campus Unit and Section users */}
          {(isUnit || isSection) && <Route path="my-unit" element={<MyUnit />} />}
          {/* Notice */}
          <Route path="notice" element={<Notice />} />
          {/* User Setup */}
          {(isEmisStaff || isAdmin) && (
            <Route path="user-setup">
              <Route path="users" element={<User />} />
              <Route path="user-roles" element={<UserRole />} />
            </Route>
          )}
          <Route path="website-setup">
            {(isEmisStaff || isAdmin || isUnit || isSection) && (
              <>
                <Route path="academic-calendars" element={<AcademicCalendars />} />
                <Route path="academic" element={<Academic />} />
                <Route path="campus-downloads" element={<CampusDownloads />} />
                <Route path="campus-feedbacks" element={<CampusFeedbacks />} />
                <Route path="campus-info" element={<CampusInfo />} />
                <Route path="campus-key-officials" element={<CampusKeyOfficials />} />
                <Route path="campus-reports" element={<CampusReports />} />
                {(isEmisStaff || isAdmin) && <Route path="campus-unions" element={<CampusUnions />} />}
                {(isEmisStaff || isAdmin || isSection) && <Route path="campus-sections" element={<CampusSections />} />}
                {(isEmisStaff || isAdmin || isUnit) && <Route path="campus-units" element={<CampusUnits />} />}
                {(isEmisStaff || isAdmin) && <Route path="departments" element={<Departments />} />}
                <Route path="research" element={<Research />} />
                <Route path="research/tags" element={<ResearchTags />} />
                <Route path="research-facilities" element={<ResearchFacilities />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/tags" element={<ProjectTags />} />
                <Route path="student-clubs-setup">
                  <Route path="student-clubs" element={<StudentClubs />} />
                </Route>
                {isEmisStaff && (
                  <Route path="emis-management">
                    <Route index element={<ManageEmis />} />
                    <Route path="hardware" element={<EmisHardware />} />
                    <Route path="vps" element={<EmisVps />} />
                    <Route path="email-reset" element={<EmisEmailReset />} />
                  </Route>
                )}
              </>
            )}
            <Route path="global-gallery" element={<GlobalGallery />} />
            <Route path="global-events" element={<GlobalEvents />} />
            {isUnion && <Route path="union-members" element={<UnionMembers />} />}
          </Route>
          {/* Contact Setup */}
          <Route path="contact-setup">
            <Route path="phone-numbers" element={<Contact />} />
          </Route>
          {/* Student Clubs Setup (accessible at top level for all roles that can reach the page) */}
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
};

export default PrivateRoutes;
