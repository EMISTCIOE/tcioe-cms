import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useGetGlobalGalleryQuery } from '../redux/globalGallery.api';
import { IGlobalGalleryItem, IGlobalGalleryListResponse } from '../redux/types';

export interface IGlobalGalleryTableRow {
  id: string;
  preview: string;
  caption: string;
  sourceType: string;
  sourceName: string;
  sourceContext?: string;
  createdAt: string;
}

export const useGlobalGalleryTable = () => {
  return createTableDataHook<IGlobalGalleryTableRow, IGlobalGalleryListResponse>({
    useListQuery: useGetGlobalGalleryQuery,
    transformResponseToTableData: (apiData) =>
      apiData?.results.map((item: IGlobalGalleryItem) => ({
        id: item.uuid,
        preview: item.image,
        caption: item.caption || '',
        sourceType: item.sourceType,
        sourceName: item.sourceName,
        sourceContext: item.sourceContext || '',
        createdAt: item.createdAt
      })) ?? []
  })();
};
