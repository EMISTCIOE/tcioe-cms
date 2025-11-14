// mui-icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Person3Icon from '@mui/icons-material/Person3';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import FeedbackIcon from '@mui/icons-material/Feedback';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import ScienceIcon from '@mui/icons-material/Science';
import LabelIcon from '@mui/icons-material/Label';

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
  FeedbackIcon,
  InfoIcon,
  LanguageIcon,
  CelebrationIcon,
  Diversity3Icon,
  PhoneIcon,
  WorkIcon,
  ScienceIcon,
  LabelIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const modules: MenuItem = {
  id: 'modules',
  title: 'Modules',
  type: 'group',
  children: [
    {
      id: 'staff-management',
      title: 'Manage Staff',
      type: 'collapse',
      icon: icons.SupervisedUserCircleIcon,
      children: [
        {
          id: 'users',
          title: 'Users',
          icon: icons.Person3Icon,
          type: 'item',
          url: '/user-setup/users',
          breadcrumbs: false
        },
        {
          id: 'global-gallery',
          title: 'Global Gallery',
          type: 'item',
          icon: icons.CelebrationIcon,
          url: '/website-setup/global-gallery',
          breadcrumbs: false
        },
        {
          id: 'user-roles',
          title: 'User Roles',
          type: 'item',
          icon: icons.ManageAccountsIcon,
          url: '/user-setup/user-roles',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'website-management',
      title: 'Manage Campus',
      type: 'collapse',
      icon: icons.LanguageIcon,
      children: [
        {
          id: 'academic-calendars',
          title: 'Academic Calendars',
          icon: icons.CalendarMonthIcon,
          type: 'item',
          url: '/website-setup/academic-calendars',
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
          id: 'campus-feedbacks',
          title: 'Campus Feedbacks',
          type: 'item',
          icon: icons.FeedbackIcon,
          url: '/website-setup/campus-feedbacks',
          breadcrumbs: false
        },
        {
          id: 'campus-info',
          title: 'Campus Info',
          type: 'item',
          icon: icons.InfoIcon,
          url: '/website-setup/campus-info',
          breadcrumbs: false
        },
        {
          id: 'campus-key-officials',
          title: 'Campus Staff',
          type: 'item',
          icon: icons.Person3Icon,
          url: '/website-setup/campus-key-officials',
          breadcrumbs: false
        },
        {
          id: 'campus-reports',
          title: 'Campus Reports',
          type: 'item',
          icon: icons.ArticleIcon,
          url: '/website-setup/campus-reports',
          breadcrumbs: false
        },
        {
          id: 'campus-events',
          title: 'Campus Events',
          type: 'item',
          icon: icons.CelebrationIcon,
          url: '/website-setup/campus-events',
          breadcrumbs: false
        },
        {
          id: 'campus-unions',
          title: 'Campus Unions',
          type: 'item',
          icon: icons.Diversity3Icon,
          url: '/website-setup/campus-unions',
          breadcrumbs: false
        },
        {
          id: 'campus-sections',
          title: 'Campus Sections',
          type: 'item',
          icon: icons.InfoIcon,
          url: '/website-setup/campus-sections',
          breadcrumbs: false
        },
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
      id: 'contact-management',
      title: 'Manage Contact Information',
      type: 'collapse',
      icon: icons.PhoneIcon,
      children: [
        {
          id: 'phone-numbers',
          title: 'Phone Numbers',
          icon: icons.PhoneIcon,
          type: 'item',
          url: '/contact-setup/phone-numbers',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'projects-management',
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
      id: 'research-management',
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
        }
      ]
    },
    {
      id: 'website-student-clubs',
      title: 'Manage Student Clubs',
      type: 'collapse',
      icon: icons.Diversity3Icon,
      children: [
        {
          id: 'student-clubs',
          title: 'Student Clubs',
          icon: icons.Diversity3Icon,
          type: 'item',
          url: '/student-clubs-setup/student-clubs',
          breadcrumbs: false
        },
        {
          id: 'student-club-events',
          title: 'Student Club Events',
          icon: icons.CelebrationIcon,
          type: 'item',
          url: '/student-clubs-setup/student-club-events',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default modules;
