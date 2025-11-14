import { createSlice } from '@reduxjs/toolkit';
import { IResearchFacilitiesSliceState } from './types';

const initialState: IResearchFacilitiesSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const researchFacilitiesSlice = createSlice({
  name: 'researchFacilities',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentResearchFacilitiesId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearResearchFacilitiesData: (state) => {
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

export const {
  setEdit,
  currentResearchFacilitiesId,
  clearResearchFacilitiesData,
  setViewId,
  clearViewId
} = researchFacilitiesSlice.actions;

export default researchFacilitiesSlice.reducer;
