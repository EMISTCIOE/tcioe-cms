import { createSlice } from '@reduxjs/toolkit';
import { ICampusUnionsSliceState } from './types';

const initialState: ICampusUnionsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusUnionsSlice = createSlice({
  name: 'CampusUnions',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusUnionsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusUnionsData: (state) => {
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

export const { setEdit, currentCampusUnionsId, clearCampusUnionsData, setViewId, clearViewId } = campusUnionsSlice.actions;

export default campusUnionsSlice.reducer;
