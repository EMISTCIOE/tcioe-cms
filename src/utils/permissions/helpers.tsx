import { IRequiredPermission } from '@/globals';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { IPermission } from '@/pages/authentication/redux/types';

export function useHasParticularPermissions(permission: string | string[]): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);
  const requiredPermissions = Array.isArray(permission) ? permission : [permission];

  if (isSuperuser) return true;

  // Union users can create, edit and delete global gallery images regardless of explicit permissions
  if (roleType === 'UNION') {
    const unionAllowedGalleryPermissions = [
      'add_globalgalleryimage',
      'change_globalgalleryimage',
      'delete_globalgalleryimage',
      'view_globalgalleryimage'
    ];
    if (requiredPermissions.some((perm) => unionAllowedGalleryPermissions.includes(perm))) {
      return true;
    }
  }

  return requiredPermissions.some((required) => permissions?.some((perm: IPermission) => perm.codename === required));
}

export function useHasGlobalEventPermissions(permission: string | string[]): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  const requiredPermissions = Array.isArray(permission) ? permission : [permission];

  // Union users can create and edit global events regardless of explicit permissions
  if (roleType === 'UNION') {
    const unionAllowedPermissions = ['add_globalevent', 'change_globalevent'];
    if (requiredPermissions.some((perm) => unionAllowedPermissions.includes(perm))) {
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

  // Union users can access global events page regardless of explicit permissions
  if (roleType === 'UNION') {
    return true;
  }

  // For other users, check if they have any of the required permissions
  const permissionsStrings = extractPermissionStrings(requiredPermissions);
  return permissionsStrings.some((permission) => permissions?.some((perm) => perm.codename === permission));
}

export function useHasGlobalGalleryPagePermissions(requiredPermissions: IRequiredPermission): boolean {
  const { permissions, isSuperuser, roleType } = useAppSelector(authState);

  if (isSuperuser) return true;

  // Union users can access global gallery page regardless of explicit permissions
  if (roleType === 'UNION') {
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
