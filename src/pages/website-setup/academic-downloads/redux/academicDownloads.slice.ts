import { createSlice } from '@reduxjs/toolkit';
import { IAcademicDownloadsSliceState } from './types';

const initialState: IAcademicDownloadsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const academicDownloadsSlice = createSlice({
  name: 'AcademicDownloads',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentAcademicDownloadsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearAcademicDownloadsData: (state) => {
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

export const { setEdit, currentAcademicDownloadsId, clearAcademicDownloadsData, setViewId, clearViewId } = academicDownloadsSlice.actions;

export default academicDownloadsSlice.reducer;
