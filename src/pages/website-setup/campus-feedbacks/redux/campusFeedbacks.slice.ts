import { createSlice } from '@reduxjs/toolkit';
import { ICampusFeedbacksSliceState } from './types';

const initialState: ICampusFeedbacksSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusFeedbacksSlice = createSlice({
  name: 'CampusFeedbacks',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusFeedbacksId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusFeedbacksData: (state) => {
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

export const { setEdit, currentCampusFeedbacksId, clearCampusFeedbacksData, setViewId, clearViewId } = campusFeedbacksSlice.actions;

export default campusFeedbacksSlice.reducer;
