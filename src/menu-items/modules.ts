// mui-icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Person3Icon from '@mui/icons-material/Person3';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import ScienceIcon from '@mui/icons-material/Science';
import LabelIcon from '@mui/icons-material/Label';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FolderIcon from '@mui/icons-material/Folder';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudIcon from '@mui/icons-material/Cloud';
import EmailIcon from '@mui/icons-material/Email';

// project-imports
import { MenuItem } from './types';

// icons
const icons = {
  SupervisedUserCircleIcon,
  ManageAccountsIcon,
  Person3Icon,
  CalendarMonthIcon,
  ArticleIcon,
  DownloadIcon,
  InfoIcon,
  CelebrationIcon,
  Diversity3Icon,
  PhoneIcon,
  WorkIcon,
  ScienceIcon,
  LabelIcon,
  SchoolIcon,
  NotificationsIcon,
  EventIcon,
  BadgeIcon,
  AccountBalanceIcon,
  BusinessIcon,
  GroupsIcon,
  MenuBookIcon,
  ClassIcon,
  SubjectIcon,
  LibraryBooksIcon,
  FolderIcon,
  PhotoLibraryIcon,
  ContactsIcon,
  PeopleIcon,
  FeedbackIcon,
  AdminPanelSettingsIcon,
  ComputerIcon,
  CloudIcon,
  EmailIcon
};

// ==============================|| MENU ITEMS - MODULES ||============================== //

const modules: MenuItem = {
  id: 'modules',
  title: 'Modules',
  type: 'group',
  children: [
    {
      id: 'manage-events',
      title: 'Manage Events',
      type: 'collapse',
      icon: icons.EventIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION', 'DEPARTMENT-ADMIN', 'CLUB'],
      children: [
        {
          id: 'global-events',
          title: 'Global Events',
          type: 'item',
          icon: icons.CelebrationIcon,
          url: '/website-setup/global-events',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN', 'UNION', 'DEPARTMENT-ADMIN', 'CLUB']
        },
        {
          id: 'global-gallery',
          title: 'Global Gallery',
          type: 'item',
          icon: icons.PhotoLibraryIcon,
          url: '/website-setup/global-gallery',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN', 'UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION', 'DEPARTMENT-ADMIN', 'CLUB']
        }
      ]
    },
    {
      id: 'manage-emis',
      title: 'Manage EMIS',
      type: 'collapse',
      icon: icons.AccountBalanceIcon,
      allowedRoles: ['EMIS-STAFF'],
      children: [
        {
          id: 'emis-hardware',
          title: 'Hardware Management',
          type: 'item',
          icon: icons.ComputerIcon,
          url: '/website-setup/emis-management/hardware',
          breadcrumbs: false
        },
        {
          id: 'emis-vps',
          title: 'VPS Management',
          type: 'item',
          icon: icons.CloudIcon,
          url: '/website-setup/emis-management/vps',
          breadcrumbs: false
        },
        {
          id: 'emis-email-reset',
          title: 'Email Reset Requests',
          type: 'item',
          icon: icons.EmailIcon,
          url: '/website-setup/emis-management/email-reset',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'union-portal',
      title: 'My Union',
      type: 'collapse',
      icon: icons.PeopleIcon,
      allowedRoles: ['UNION'],
      children: [
        {
          id: 'union-members',
          title: 'Union Members',
          type: 'item',
          icon: icons.GroupsIcon,
          url: '/website-setup/union-members',
          breadcrumbs: false,
          allowedRoles: ['UNION']
        }
      ]
    },
    {
      id: 'manage-staff',
      title: 'Manage Staff',
      type: 'collapse',
      icon: icons.BadgeIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN'],
      children: [
        {
          id: 'campus-staff',
          title: 'Campus Staff',
          type: 'item',
          icon: icons.Person3Icon,
          url: '/website-setup/campus-key-officials',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-unions',
      title: 'Manage Unions',
      type: 'collapse',
      icon: icons.AccountBalanceIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN'],
      children: [
        {
          id: 'campus-unions',
          title: 'Campus Unions',
          type: 'item',
          icon: icons.Diversity3Icon,
          url: '/website-setup/campus-unions',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-units',
      title: 'Manage Units & Sections',
      type: 'collapse',
      icon: icons.BusinessIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'CAMPUS-UNIT', 'CAMPUS-SECTION'],
      children: [
        {
          id: 'my-unit',
          title: 'My Unit',
          type: 'item',
          icon: icons.Person3Icon,
          url: '/my-unit',
          breadcrumbs: false,
          allowedRoles: ['CAMPUS-UNIT']
        },
        {
          id: 'my-section',
          title: 'My Section',
          type: 'item',
          icon: icons.Person3Icon,
          url: '/my-unit',
          breadcrumbs: false,
          allowedRoles: ['CAMPUS-SECTION']
        },
        {
          id: 'campus-units',
          title: 'Campus Units',
          type: 'item',
          icon: icons.InfoIcon,
          url: '/website-setup/campus-units',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'campus-sections',
          title: 'Campus Sections',
          type: 'item',
          icon: icons.BusinessIcon,
          url: '/website-setup/campus-sections',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        }
      ]
    },
  {
    id: 'manage-clubs',
    title: 'Manage Clubs',
    type: 'collapse',
    icon: icons.GroupsIcon,
    allowedRoles: ['EMIS-STAFF', 'ADMIN'],
    children: [
      {
        id: 'student-clubs',
        title: 'Student Clubs',
        icon: icons.Diversity3Icon,
        type: 'item',
        url: '/student-clubs-setup/student-clubs',
        breadcrumbs: false,
        allowedRoles: ['EMIS-STAFF', 'ADMIN']
      }
    ]
  },
  {
    id: 'my-club',
    title: 'My Club',
    type: 'item',
    icon: icons.GroupsIcon,
    url: '/student-clubs-setup/student-clubs',
    breadcrumbs: false,
    allowedRoles: ['CLUB']
  },
    {
      id: 'manage-academic',
      title: 'Manage Academic',
      type: 'collapse',
      icon: icons.SchoolIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN'],
      children: [
        {
          id: 'departments',
          title: 'Departments',
          type: 'item',
          icon: icons.BusinessIcon,
          url: '/website-setup/departments',
          breadcrumbs: false
        },
        {
          id: 'academic',
          title: 'Programs & Subjects',
          type: 'item',
          icon: icons.ClassIcon,
          url: '/website-setup/academic',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-resources',
      title: 'Manage Resources',
      type: 'collapse',
      icon: icons.FolderIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN'],
      children: [
        {
          id: 'academic-downloads',
          title: 'Academic Downloads',
          type: 'item',
          icon: icons.DownloadIcon,
          url: '/website-setup/academic-downloads',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN']
        },
        {
          id: 'campus-downloads',
          title: 'Campus Downloads',
          type: 'item',
          icon: icons.DownloadIcon,
          url: '/website-setup/campus-downloads',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'contact-directory',
          title: 'Contact Directory',
          type: 'item',
          icon: icons.ContactsIcon,
          url: '/contact-setup/phone-numbers',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'campus-feedbacks',
          title: 'Campus Feedbacks',
          type: 'item',
          icon: icons.FeedbackIcon,
          url: '/website-setup/campus-feedbacks',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        }
      ]
    },
    {
      id: 'manage-projects',
      title: 'Manage Projects',
      type: 'collapse',
      icon: icons.WorkIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN'],
      children: [
        {
          id: 'projects',
          title: 'Projects',
          icon: icons.WorkIcon,
          type: 'item',
          url: '/website-setup/projects',
          breadcrumbs: false
        },
        {
          id: 'project-tags',
          title: 'Project Tags',
          icon: icons.LabelIcon,
          type: 'item',
          url: '/website-setup/projects/tags',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-research',
      title: 'Manage Research',
      type: 'collapse',
      icon: icons.ScienceIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN'],
      children: [
        {
          id: 'research',
          title: 'Research',
          icon: icons.ScienceIcon,
          type: 'item',
          url: '/website-setup/research',
          breadcrumbs: false
        },
        {
          id: 'research-tags',
          title: 'Research Tags',
          icon: icons.LabelIcon,
          type: 'item',
          url: '/website-setup/research/tags',
          breadcrumbs: false
        },
        {
          id: 'research-facilities',
          title: 'Research Facilities',
          icon: icons.ScienceIcon,
          type: 'item',
          url: '/website-setup/research-facilities',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      type: 'collapse',
      icon: icons.PeopleIcon,
      allowedRoles: ['EMIS-STAFF', 'ADMIN'],
      children: [
        {
          id: 'users-emis-staff',
          title: 'EMIS Staff',
          icon: icons.BadgeIcon,
          type: 'item',
          url: '/user-setup/users?role=EMIS-STAFF',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-admin',
          title: 'Admin',
          icon: icons.ManageAccountsIcon,
          type: 'item',
          url: '/user-setup/users?role=ADMIN',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-department-admin',
          title: 'Department Admin',
          icon: icons.AdminPanelSettingsIcon,
          type: 'item',
          url: '/user-setup/users?role=DEPARTMENT-ADMIN',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-club',
          title: 'Club Users',
          icon: icons.GroupsIcon,
          type: 'item',
          url: '/user-setup/users?role=CLUB',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-union',
          title: 'Union Users',
          icon: icons.Diversity3Icon,
          type: 'item',
          url: '/user-setup/users?role=UNION',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-campus-unit',
          title: 'Campus Unit Users',
          icon: icons.BusinessIcon,
          type: 'item',
          url: '/user-setup/users?role=CAMPUS-UNIT',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        },
        {
          id: 'users-campus-section',
          title: 'Campus Section Users',
          icon: icons.ClassIcon,
          type: 'item',
          url: '/user-setup/users?role=CAMPUS-SECTION',
          breadcrumbs: false,
          allowedRoles: ['EMIS-STAFF', 'ADMIN']
        }
      ]
    }
  ]
};

export default modules;
