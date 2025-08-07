import { createSlice } from '@reduxjs/toolkit';
import { ICampusReportsSliceState } from './types';

const initialState: ICampusReportsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusReportsSlice = createSlice({
  name: 'CampusReports',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusReportsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusReportsData: (state) => {
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

export const { setEdit, currentCampusReportsId, clearCampusReportsData, setViewId, clearViewId } = campusReportsSlice.actions;

export default campusReportsSlice.reducer;
