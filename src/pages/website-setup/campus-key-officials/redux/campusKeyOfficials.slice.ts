import { createSlice } from '@reduxjs/toolkit';
import { ICampusKeyOfficialsSliceState } from './types';

const initialState: ICampusKeyOfficialsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campuskeyOfficialsSlice = createSlice({
  name: 'CampuskeyOfficials',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampuskeyOfficialsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampuskeyOfficialsData: (state) => {
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

export const { setEdit, currentCampuskeyOfficialsId, clearCampuskeyOfficialsData, setViewId, clearViewId } =
  campuskeyOfficialsSlice.actions;

export default campuskeyOfficialsSlice.reducer;
