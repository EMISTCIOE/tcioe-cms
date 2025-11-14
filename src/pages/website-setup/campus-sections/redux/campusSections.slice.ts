import { createSlice } from '@reduxjs/toolkit';
import { ICampusSectionsSliceState } from './types';

const initialState: ICampusSectionsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusSectionsSlice = createSlice({
  name: 'CampusSections',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusSectionsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusSectionsData: (state) => {
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

export const { setEdit, currentCampusSectionsId, clearCampusSectionsData, setViewId, clearViewId } = campusSectionsSlice.actions;

export default campusSectionsSlice.reducer;
