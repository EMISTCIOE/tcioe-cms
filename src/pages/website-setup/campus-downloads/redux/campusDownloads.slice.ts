import { createSlice } from '@reduxjs/toolkit';
import { ICampusDownloadsSliceState } from './types';

const initialState: ICampusDownloadsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusdownloadsSlice = createSlice({
  name: 'Campusdownloads',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusdownloadsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusdownloadsData: (state) => {
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

export const { setEdit, currentCampusdownloadsId, clearCampusdownloadsData, setViewId, clearViewId } =
  campusdownloadsSlice.actions;

export default campusdownloadsSlice.reducer;
