// mui-icons imports
import { DashboardOutlined, Campaign, Summarize , School} from '@mui/icons-material';
import { MenuItem } from './types';

// icons
const icons = { DashboardOutlined, Summarize, Campaign, School };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const pages: MenuItem = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'notice',
      title: 'Notice',
      type: 'item',
      url: '/notice',
      icon: icons.Campaign,
      breadcrumbs: false
    },
     {
      id: 'college',
      title: 'College',
      type: 'item',
      url: '/college',
      icon: icons.School,
      breadcrumbs: false
    },
    
  ]
};

export default pages;
