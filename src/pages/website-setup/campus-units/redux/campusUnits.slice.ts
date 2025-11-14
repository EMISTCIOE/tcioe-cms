import { createSlice } from '@reduxjs/toolkit';
import { ICampusUnitsSliceState } from './types';

const initialState: ICampusUnitsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusUnitsSlice = createSlice({
  name: 'CampusUnits',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusUnitsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusUnitsData: (state) => {
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

export const { setEdit, currentCampusUnitsId, clearCampusUnitsData, setViewId, clearViewId } = campusUnitsSlice.actions;

export default campusUnitsSlice.reducer;
