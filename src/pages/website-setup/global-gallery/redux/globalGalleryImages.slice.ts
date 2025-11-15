import { createSlice } from '@reduxjs/toolkit';
import { IGlobalGalleryImagesSliceState } from './types';

const initialState: IGlobalGalleryImagesSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const globalGalleryImagesSlice = createSlice({
  name: 'globalGalleryImages',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    setCurrentImageId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearImageData: (state) => {
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

export const { setEdit, setCurrentImageId, clearImageData, setViewId, clearViewId } =
  globalGalleryImagesSlice.actions;

export default globalGalleryImagesSlice.reducer;
