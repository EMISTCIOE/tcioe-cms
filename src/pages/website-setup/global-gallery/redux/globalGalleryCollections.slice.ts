import { createSlice } from '@reduxjs/toolkit';
import { IGlobalGalleryCollectionsSliceState } from './types';

const initialState: IGlobalGalleryCollectionsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const globalGalleryCollectionsSlice = createSlice({
  name: 'globalGalleryCollections',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentGlobalGalleryCollectionsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearGlobalGalleryCollectionsData: (state) => {
      state.edit = false;
      state.currentId = null;
    },
    setViewId: (state, { payload }) => {
      state.viewId = payload;
    },
    clearViewId: (state) => {
      state.viewId = null;
    }
  }
});

export const { setEdit, currentGlobalGalleryCollectionsId, clearGlobalGalleryCollectionsData, setViewId, clearViewId } =
  globalGalleryCollectionsSlice.actions;

export default globalGalleryCollectionsSlice.reducer;
