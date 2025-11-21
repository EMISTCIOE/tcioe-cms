import { ComponentType, useEffect, useState, useMemo } from 'react';

import { IRequiredPermission } from '@/globals';
import { useAppDispatch } from '@/libs/hooks';
import { useAppSelector } from '@/libs/hooks';
import { setPermissions } from '@/pages/common/redux/common.slice';
import Unauthorized from '@/pages/errors/Unauthorized';
import {
  extractPermissionStrings,
  useHasAnyPermissions,
  useHasGlobalEventPagePermissions,
  useHasGlobalGalleryPagePermissions
} from './helpers';
import { authState } from '@/pages/authentication/redux/selector';

interface Props {}

export const validatePermissions = <P extends Props>(Component: ComponentType<P>, requiredPermissions: IRequiredPermission) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const dispatch = useAppDispatch();
    const { roleType } = useAppSelector(authState);

    // Extract permission strings once
    const permissionsStrings = useMemo(() => extractPermissionStrings(requiredPermissions), [requiredPermissions]);
    const hasPermission = useHasAnyPermissions(permissionsStrings);
    const [showMessage, setShowMessage] = useState(false);

    // Allow role-based users through (Admin, EMIS-STAFF have broad access, UI scopes others)
    if (['ADMIN', 'EMIS-STAFF', 'UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || '')) {
      return <Component {...props} />;
    }

    useEffect(() => {
      //set current component permission constants in redux
      dispatch(setPermissions(permissionsStrings));
      return () => {
        // remove permissions on unmount
        dispatch(setPermissions([]));
      };
    }, []);

    useEffect(() => {
      if (!hasPermission) {
        setShowMessage(true);
      }
    }, [hasPermission]);

    if (showMessage) return <Unauthorized />;

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export const validateGlobalEventPermissions = <P extends Props>(Component: ComponentType<P>, requiredPermissions: IRequiredPermission) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const dispatch = useAppDispatch();

    // Extract permission strings once
    const permissionsStrings = extractPermissionStrings(requiredPermissions);
    const hasPermission = useHasGlobalEventPagePermissions(requiredPermissions);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
      //set current component permission constants in redux
      dispatch(setPermissions(permissionsStrings));
      return () => {
        // remove permissions on unmount
        dispatch(setPermissions([]));
      };
    }, []);

    useEffect(() => {
      if (!hasPermission) {
        setShowMessage(true);
      }
    }, [hasPermission]);

    if (showMessage) return <Unauthorized />;

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export const validateGlobalGalleryPermissions = <P extends Props>(
  Component: ComponentType<P>,
  requiredPermissions: IRequiredPermission
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const dispatch = useAppDispatch();

    // Extract permission strings once
    const permissionsStrings = extractPermissionStrings(requiredPermissions);
    const hasPermission = useHasGlobalGalleryPagePermissions(requiredPermissions);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
      //set current component permission constants in redux
      dispatch(setPermissions(permissionsStrings));
      return () => {
        // remove permissions on unmount
        dispatch(setPermissions([]));
      };
    }, []);

    useEffect(() => {
      if (!hasPermission) {
        setShowMessage(true);
      }
    }, [hasPermission]);

    if (showMessage) return <Unauthorized />;

    return <Component {...props} />;
  };

  return WrappedComponent;
};
