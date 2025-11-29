import { useState, useCallback, useMemo } from 'react';
import { GridRowId, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import {
  useGetEmisHardwareQuery,
  useCreateEmisHardwareMutation,
  useUpdateEmisHardwareMutation,
  useDeleteEmisHardwareMutation
} from '../redux/emis.api';
import { IEmisHardware, IEmisHardwareCreatePayload } from '../types';

export const useHardwareTable = () => {
  const { enqueueSnackbar } = useSnackbar();

  // Table state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [searchText, setSearchText] = useState('');

  // API queries and mutations
  const { data: hardwareData, isLoading, error: hardwareError, refetch } = useGetEmisHardwareQuery();
  const [createHardware, { isLoading: createLoading }] = useCreateEmisHardwareMutation();
  const [updateHardware, { isLoading: updateLoading }] = useUpdateEmisHardwareMutation();
  const [deleteHardware, { isLoading: deleteLoading }] = useDeleteEmisHardwareMutation();

  const extractErrorMessage = (error: any, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error?.data === 'string') return error.data;
    return error?.data?.detail || error?.data?.message || fallback;
  };

  // Process hardware data for table
  const hardwareList = useMemo(() => {
    if (!hardwareData?.results) return [];
    return hardwareData.results.map((item: IEmisHardware) => ({
      ...item,
      // Normalize data for consistent access
      ipAddress: item.ip_address,
      hardwareType: item.hardware_type,
      assetTag: item.asset_tag,
      thumbnailImage: item.thumbnail_image
    }));
  }, [hardwareData]);

  // Filtered and searched data
  const filteredHardware = useMemo(() => {
    if (!searchText.trim()) return hardwareList;

    const searchLower = searchText.toLowerCase();
    return hardwareList.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.asset_tag?.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower) ||
        item.hardware_type?.toLowerCase().includes(searchLower) ||
        item.ip_address?.toLowerCase().includes(searchLower) ||
        item.manufacturer?.toLowerCase().includes(searchLower) ||
        item.model_number?.toLowerCase().includes(searchLower)
    );
  }, [hardwareList, searchText]);

  // Handlers
  const handlePaginationChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  const handleSortChange = useCallback((model: GridSortModel) => {
    setSortModel(model);
  }, []);

  const handleFilterChange = useCallback((model: GridFilterModel) => {
    setFilterModel(model);
  }, []);

  const handleSave = useCallback(
    async (updatedRow: IEmisHardware) => {
      try {
        // Convert the updated row back to the format expected by the API
        const formData = new FormData();

        // Add all the required fields
        formData.append('name', updatedRow.name);
        formData.append('hardware_type', updatedRow.hardware_type);
        formData.append('environment', updatedRow.environment);
        formData.append('status', updatedRow.status);

        // Add optional fields if they exist
        if (updatedRow.asset_tag) formData.append('asset_tag', updatedRow.asset_tag);
        if (updatedRow.manufacturer) formData.append('manufacturer', updatedRow.manufacturer);
        if (updatedRow.model_number) formData.append('model_number', updatedRow.model_number);
        if (updatedRow.serial_number) formData.append('serial_number', updatedRow.serial_number);
        if (updatedRow.ip_address) formData.append('ip_address', updatedRow.ip_address);
        if (updatedRow.location) formData.append('location', updatedRow.location);
        if (updatedRow.responsible_team) formData.append('responsible_team', updatedRow.responsible_team);
        if (updatedRow.description) formData.append('description', updatedRow.description);

        await updateHardware({ id: updatedRow.id, data: formData }).unwrap();

        enqueueSnackbar('Hardware updated successfully', { variant: 'success' });
        refetch();
      } catch (error: any) {
        const message = extractErrorMessage(error, 'Failed to update hardware');
        enqueueSnackbar(message, { variant: 'error' });
        throw error;
      }
    },
    [updateHardware, enqueueSnackbar, refetch, extractErrorMessage]
  );

  const handleDelete = useCallback(
    async (id: GridRowId) => {
      try {
        await deleteHardware(id as string).unwrap();
        enqueueSnackbar('Hardware deleted successfully', { variant: 'success' });
        refetch();
      } catch (error: any) {
        const message = extractErrorMessage(error, 'Failed to delete hardware');
        enqueueSnackbar(message, { variant: 'error' });
        throw error;
      }
    },
    [deleteHardware, enqueueSnackbar, refetch, extractErrorMessage]
  );

  const handleEditClick = useCallback((id: GridRowId) => {
    // This can be implemented if needed for custom edit behavior
    console.log('Edit clicked for:', id);
  }, []);

  const handleviewDetailsClick = useCallback(async (id: GridRowId) => {
    // This can be implemented if needed for custom view behavior
    console.log('View details clicked for:', id);
  }, []);

  const handleRowUpdateError = useCallback(
    (error: any) => {
      const message = extractErrorMessage(error, 'Failed to update row');
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar, extractErrorMessage]
  );

  return {
    // Table data
    rows: filteredHardware,
    totalRowsCount: filteredHardware.length,
    loading: isLoading || createLoading || updateLoading || deleteLoading,

    // Search
    searchText,
    setSearchText,

    // Table handlers
    handleSave,
    handleDelete,
    handleEditClick,
    handleviewDetailsClick,
    handleRowUpdateError,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange,

    // Table state
    paginationModel,
    filterModel,
    sortModel,
    pageSizeOptions: [5, 10, 20, 50],

    // Additional data for forms/dialogs
    hardwareData,
    refetch,
    createHardware,
    updateHardware,
    deleteHardware,
    error: hardwareError,

    // Loading states
    createLoading,
    updateLoading,
    deleteLoading
  };
};
