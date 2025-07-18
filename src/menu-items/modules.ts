// mui-icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Person3Icon from '@mui/icons-material/Person3';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

// project-imports
import { MenuItem } from './types';

// icons
const icons = {
  SupervisedUserCircleIcon,
  ManageAccountsIcon,
  Person3Icon
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
          id: 'user-roles',
          title: 'User Roles',
          type: 'item',
          icon: icons.ManageAccountsIcon,
          url: '/user-setup/user-roles',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default modules;
