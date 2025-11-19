import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project import
import { useMenuSearch } from '@/contexts/search-context';
import { useAppSelector } from '@/libs/hooks';
import menuItems from '@/menu-items';
import { MenuItem } from '@/menu-items/types';
import { authState } from '@/pages/authentication/redux/selector';
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { searchTerm } = useMenuSearch();
  const { roleType } = useAppSelector(authState);

  const isSearching = !!searchTerm.trim();

  const roleFilteredMenu = menuItems?.items
    .map((group) => filterByRole(group, roleType))
    .filter((group): group is MenuItem => Boolean(group));

  // Filter groups here before rendering
  const filteredGroups = roleFilteredMenu
    ?.map((group) => searchMenu(group, searchTerm))
    .filter((group): group is MenuItem => Boolean(group));

  if (!filteredGroups?.length) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 2 }}>
        No Results Found!
      </Typography>
    );
  }

  const navGroups = filteredGroups?.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} isSearching={isSearching} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}

/**
 * Recursive search preserving hierarchy
 */
export function searchMenu(item: MenuItem, searchTerm: string): MenuItem | null {
  const match = item?.title.toLowerCase().includes(searchTerm.toLowerCase());

  if (item.children) {
    const matchedChildren = item?.children.map((child) => searchMenu(child, searchTerm)).filter(Boolean) as MenuItem[];

    if (match || matchedChildren.length > 0) {
      return {
        ...item,
        children: matchedChildren
      };
    }
  }

  if (match) {
    return { ...item };
  }

  return null;
}

function filterByRole(item: MenuItem, roleType?: string): MenuItem | null {
  if (item.allowedRoles && (!roleType || !item.allowedRoles.includes(roleType))) {
    return null;
  }

  if (!item.children || !item.children.length) {
    return { ...item };
  }

  const children = item.children.map((child) => filterByRole(child, roleType)).filter((child): child is MenuItem => Boolean(child));

  if (!children.length) {
    return null;
  }

  return {
    ...item,
    children
  };
}
