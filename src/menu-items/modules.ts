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
  AdminPanelSettingsIcon
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
      children: [
        {
          id: 'global-events',
          title: 'Global Events',
          type: 'item',
          icon: icons.CelebrationIcon,
          url: '/website-setup/global-events',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-staff',
      title: 'Manage Staff',
      type: 'collapse',
      icon: icons.BadgeIcon,
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
      title: 'Manage Units',
      type: 'collapse',
      icon: icons.BusinessIcon,
      children: [
        {
          id: 'campus-units',
          title: 'Campus Units',
          type: 'item',
          icon: icons.InfoIcon,
          url: '/website-setup/campus-units',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-clubs',
      title: 'Manage Clubs',
      type: 'collapse',
      icon: icons.GroupsIcon,
      children: [
        {
          id: 'student-clubs',
          title: 'Student Clubs',
          icon: icons.Diversity3Icon,
          type: 'item',
          url: '/student-clubs-setup/student-clubs',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-academic',
      title: 'Manage Academic',
      type: 'collapse',
      icon: icons.SchoolIcon,
      children: [
        {
          id: 'departments',
          title: 'Departments',
          type: 'item',
          icon: icons.MenuBookIcon,
          url: '/website-setup/departments',
          breadcrumbs: false
        },
        {
          id: 'curriculum',
          title: 'Curriculum',
          type: 'item',
          icon: icons.ClassIcon,
          url: '/website-setup/curriculum',
          breadcrumbs: false
        },
        {
          id: 'subjects',
          title: 'Subjects',
          type: 'item',
          icon: icons.SubjectIcon,
          url: '/website-setup/subjects',
          breadcrumbs: false
        },
        {
          id: 'programs',
          title: 'Programs',
          type: 'item',
          icon: icons.LibraryBooksIcon,
          url: '/website-setup/programs',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-resources',
      title: 'Manage Resources',
      type: 'collapse',
      icon: icons.FolderIcon,
      children: [
        {
          id: 'academic-downloads',
          title: 'Academic Downloads',
          type: 'item',
          icon: icons.DownloadIcon,
          url: '/website-setup/academic-downloads',
          breadcrumbs: false
        },
        {
          id: 'campus-downloads',
          title: 'Campus Downloads',
          type: 'item',
          icon: icons.DownloadIcon,
          url: '/website-setup/campus-downloads',
          breadcrumbs: false
        },
        {
          id: 'global-gallery',
          title: 'Global Gallery',
          type: 'item',
          icon: icons.PhotoLibraryIcon,
          url: '/website-setup/global-gallery',
          breadcrumbs: false
        },
        {
          id: 'contact-directory',
          title: 'Contact Directory',
          type: 'item',
          icon: icons.ContactsIcon,
          url: '/contact-setup/phone-numbers',
          breadcrumbs: false
        },
        {
          id: 'campus-feedbacks',
          title: 'Campus Feedbacks',
          type: 'item',
          icon: icons.FeedbackIcon,
          url: '/website-setup/campus-feedbacks',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'manage-projects',
      title: 'Manage Projects',
      type: 'collapse',
      icon: icons.WorkIcon,
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
      children: [
        {
          id: 'teachers',
          title: 'Teachers',
          icon: icons.SchoolIcon,
          type: 'item',
          url: '/user-setup/teachers',
          breadcrumbs: false
        },
        {
          id: 'students',
          title: 'Students',
          icon: icons.Person3Icon,
          type: 'item',
          url: '/user-setup/students',
          breadcrumbs: false
        },
        {
          id: 'admin',
          title: 'Admin',
          icon: icons.ManageAccountsIcon,
          type: 'item',
          url: '/user-setup/admin',
          breadcrumbs: false
        },
        {
          id: 'department-admin',
          title: 'Department Admin',
          icon: icons.AdminPanelSettingsIcon,
          type: 'item',
          url: '/user-setup/department-admin',
          breadcrumbs: false
        },
        {
          id: 'staff',
          title: 'Staff',
          icon: icons.SupervisedUserCircleIcon,
          type: 'item',
          url: '/user-setup/staff',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default modules;
