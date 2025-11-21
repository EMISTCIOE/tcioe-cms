import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useDeleteGlobalGalleryImageMutation, useGetGlobalGalleryImagesQuery } from '../redux/globalGalleryImages.api';
import { setCurrentImageId, setEdit, setViewId } from '../redux/globalGalleryImages.slice';
import { IGlobalGalleryImage, IGlobalGalleryImageList } from '../redux/globalGalleryImages.types';
import { IGlobalGalleryImageTableRow } from '../components/listing/config';

export const useGlobalGalleryImagesTable = () => {
  const dispatch = useAppDispatch();
  const { roleType, campusUnitId, campusSectionId, campusUnitName, campusSectionName, departmentId, departmentName, clubId, clubName } =
    useAppSelector(authState);

  return createTableDataHook<IGlobalGalleryImageTableRow, IGlobalGalleryImageList>({
    useListQuery: useGetGlobalGalleryImagesQuery,
    useDeleteMutation: useDeleteGlobalGalleryImageMutation,
    transformResponseToTableData: (apiData) => {
      let filteredResults = apiData?.results || [];

      if (roleType === 'CLUB' && clubId) {
        const normalizedClubName = clubName?.toLowerCase();
        filteredResults = filteredResults.filter((item: IGlobalGalleryImage) => {
          const isClubContent = ['club_gallery', 'club_event'].includes(item.sourceType || '');
          const matchesClub = normalizedClubName ? Boolean(item.sourceName?.toLowerCase().includes(normalizedClubName)) : true;
          return isClubContent && matchesClub;
        });
      } else if (roleType === 'DEPARTMENT-ADMIN' && departmentId) {
        const normalizedDepartmentName = departmentName?.toLowerCase();
        filteredResults = filteredResults.filter((item: IGlobalGalleryImage) => {
          const isDepartmentContent = item.sourceType === 'department_gallery';
          const matchesDepartment = normalizedDepartmentName
            ? Boolean(item.sourceName?.toLowerCase().includes(normalizedDepartmentName))
            : true;
          return isDepartmentContent && matchesDepartment;
        });
      }

      // Apply role-based filtering since backend might not be doing it properly
      if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
        const unitName = campusUnitName || 'My Unit';
        filteredResults = filteredResults.filter(
          (item: IGlobalGalleryImage) =>
            item.sourceType === 'unit_gallery' && (item.sourceName === unitName || item.sourceName?.toLowerCase().includes('unit'))
        );
        console.log('Filtering for Campus Unit:', {
          unitName,
          campusUnitId,
          originalCount: apiData?.results?.length,
          filteredCount: filteredResults.length
        });
      } else if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
        const sectionName = campusSectionName || 'My Section';
        filteredResults = filteredResults.filter(
          (item: IGlobalGalleryImage) =>
            item.sourceType === 'section_gallery' && (item.sourceName === sectionName || item.sourceName?.toLowerCase().includes('section'))
        );
        console.log('Filtering for Campus Section:', {
          sectionName,
          campusSectionId,
          originalCount: apiData?.results?.length,
          filteredCount: filteredResults.length
        });
      }

      return filteredResults.map((item: IGlobalGalleryImage) => ({
        id: item.id,
        image: item.image,
        caption: item.caption || '',
        sourceType: item.sourceType,
        sourceName: item.sourceName,
        sourceContext: item.sourceContext || undefined,
        isActive: item.isActive,
        createdAt: item.createdAt
      }));
    },
    setId: (id) => {
      dispatch(setCurrentImageId(Number(id)));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(Number(id)));
    }
  });
};
