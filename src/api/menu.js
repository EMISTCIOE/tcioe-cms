import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const initialState = {
  openedItem: 'dashboard',
  openedComponent: 'buttons',
  openedHorizontalItem: null,
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true
};

export const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard' // server URL
};

const menuQueryKey = [endpoints.key, endpoints.master];

export function useGetMenuMaster() {
  const { data, isPending } = useQuery({
    queryKey: menuQueryKey,
    queryFn: async () => initialState,
    staleTime: Infinity,
    gcTime: Infinity
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data ?? initialState,
      menuMasterLoading: isPending
    }),
    [data, isPending]
  );

  return memoizedValue;
}

export function useMenuActions() {
  const queryClient = useQueryClient();

  const setDrawerOpen = useCallback((isDashboardDrawerOpened) => {
    queryClient.setQueryData(menuQueryKey, (currentMenuMaster = initialState) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened
    }));
  }, [queryClient]);

  const setActiveItem = useCallback((openedItem) => {
    queryClient.setQueryData(menuQueryKey, (currentMenuMaster = initialState) => ({
      ...currentMenuMaster,
      openedItem
    }));
  }, [queryClient]);

  return {
    setDrawerOpen,
    setActiveItem
  };
}
