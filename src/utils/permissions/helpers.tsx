import { IRequiredPermission } from '@/globals';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { IPermission } from '@/pages/authentication/redux/types';

export function useHasParticularPermissions(permission: string | string[]): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);
  const requiredPermissions = Array.isArray(permission) ? permission : [permission];

  if (isSuperuser) return true;

  // Role-based permissions for specific actions
  if (roleType === 'EMIS-STAFF') {
    return true; // Full access to all modules
  }

  if (roleType === 'ADMIN') {
    // Full access except EMIS-specific modules
    const emisRestrictedPermissions = [
      'add_emis_hardware',
      'change_emis_hardware',
      'delete_emis_hardware',
      'view_emis_hardware',
      'add_emis_vps',
      'change_emis_vps',
      'delete_emis_vps',
      'view_emis_vps'
    ];

    if (requiredPermissions.some((perm) => emisRestrictedPermissions.includes(perm))) {
      return false;
    }
    return true;
  }

  // Unit role permissions
  if (roleType === 'CAMPUS-UNIT') {
    const unitAllowedPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage',
      'add_notice',
      'change_notice',
      'delete_notice',
      'view_notice'
    ];
    if (requiredPermissions.some((perm) => unitAllowedPermissions.includes(perm))) {
      return true;
    }
    return false;
  }

  // Section role permissions
  if (roleType === 'CAMPUS-SECTION') {
    const sectionAllowedPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage',
      'add_notice',
      'change_notice',
      'delete_notice',
      'view_notice'
    ];
    if (requiredPermissions.some((perm) => sectionAllowedPermissions.includes(perm))) {
      return true;
    }
    return false;
  }

  // Union role permissions
  if (roleType === 'UNION') {
    const unionAllowedPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage',
      'add_globalevent',
      'change_globalevent',
      'delete_globalevent',
      'view_globalevent'
    ];

    // Union users cannot create notices
    const unionRestrictedPermissions = ['add_notice', 'change_notice', 'delete_notice'];

    if (requiredPermissions.some((perm) => unionRestrictedPermissions.includes(perm))) {
      return false;
    }

    if (requiredPermissions.some((perm) => unionAllowedPermissions.includes(perm))) {
      return true;
    }
    return false;
  }

  // Department Admin permissions (department-scoped content only)
  if (roleType === 'DEPARTMENT-ADMIN') {
    const departmentAllowedPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage',
      'add_notice',
      'change_notice',
      'delete_notice',
      'view_notice',
      'add_globalevent',
      'change_globalevent',
      'delete_globalevent',
      'view_globalevent'
    ];
    if (requiredPermissions.some((perm) => departmentAllowedPermissions.includes(perm))) {
      return true;
    }
    return false;
  }

  // Student Club role permissions
  if (roleType === 'CLUB') {
    const clubAllowedPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage',
      'add_globalevent',
      'change_globalevent',
      'delete_globalevent',
      'view_globalevent',
      'add_notice',
      'change_notice',
      'delete_notice',
      'view_notice'
    ];
    if (requiredPermissions.some((perm) => clubAllowedPermissions.includes(perm))) {
      return true;
    }
    return false;
  }

  // Default permission check for other roles
  return requiredPermissions.some((required) => permissions?.some((perm: IPermission) => perm.codename === required));
}

export function useHasGlobalEventPermissions(permission: string | string[]): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  const requiredPermissions = Array.isArray(permission) ? permission : [permission];

  // Union users can create and edit global events but not delete them
  if (roleType === 'UNION') {
    const unionAllowedPermissions = ['add_globalevent', 'change_globalevent', 'view_globalevent'];
    const unionRestrictedPermissions = ['delete_globalevent'];

    if (requiredPermissions.some((perm) => unionRestrictedPermissions.includes(perm))) {
      return false;
    }

    if (requiredPermissions.some((perm) => unionAllowedPermissions.includes(perm))) {
      return true;
    }
  }

  // Unit and Section users can create and edit global events for their scope
  if (['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || '')) {
    const scopeAllowedPermissions = ['add_globalevent', 'change_globalevent', 'view_globalevent'];
    if (requiredPermissions.some((perm) => scopeAllowedPermissions.includes(perm))) {
      return true;
    }
  }

  // Department Admins and Student Clubs can also create/edit/view scoped events
  if (['DEPARTMENT-ADMIN', 'CLUB'].includes(roleType || '')) {
    const departmentScopePermissions = ['add_globalevent', 'change_globalevent', 'view_globalevent'];
    if (requiredPermissions.some((perm) => departmentScopePermissions.includes(perm))) {
      return true;
    }
  }

  return requiredPermissions.some((required) => permissions?.some((perm: IPermission) => perm.codename === required)) || false;
}


export function useHasAnyPermissions(requiredPermissions: string[]): boolean {
  const { permissions, isSuperuser } = useAppSelector(authState);

  if (isSuperuser) return true;
  return requiredPermissions.some((permission) => permissions?.some((perm) => perm.codename === permission));
}

export const extractPermissionStrings = (permissionsObj: IRequiredPermission): string[] => {
  return Object.values(permissionsObj)
    .flatMap((permission) => (Array.isArray(permission) ? permission : [permission]))
    .filter((permission): permission is string => Boolean(permission));
};

export function useHasGlobalEventPagePermissions(requiredPermissions: IRequiredPermission): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  // Admin/EMIS-STAFF have broad access, Union/Unit/Section users can access with scoped permissions
  if (['ADMIN', 'EMIS-STAFF', 'UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION', 'DEPARTMENT-ADMIN', 'CLUB'].includes(roleType || '')) {
    return true;
  }

  // For other users, check if they have any of the required permissions
  const permissionsStrings = extractPermissionStrings(requiredPermissions);
  return permissionsStrings.some((permission) => permissions?.some((perm) => perm.codename === permission));
}

export function useHasGlobalGalleryPagePermissions(requiredPermissions: IRequiredPermission): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  // Admin/EMIS-STAFF have broad access, Union/Unit/Section users can access with scoped permissions
  if (['ADMIN', 'EMIS-STAFF', 'UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION', 'DEPARTMENT-ADMIN', 'CLUB'].includes(roleType || '')) {
    return true;
  }

  // For other users, check if they have any of the required permissions
  const permissionsStrings = extractPermissionStrings(requiredPermissions);
  return permissionsStrings.some((permission) => permissions?.some((perm) => perm.codename === permission));
}

export function useCanChangeApprovalStatus(): boolean {
  const { isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  // Admin and EMIS staff can change approval status
  return roleType === 'ADMIN' || roleType === 'EMIS-STAFF';
}

export function useCanAccessApprovalFields(): boolean {
  const { isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  // Only Admin and EMIS staff can access approval fields (Featured, Draft, Approved by Campus, Approved by Department)
  // Union, Unit, and Section users cannot access these fields
  return roleType === 'ADMIN' || roleType === 'EMIS-STAFF';
}
