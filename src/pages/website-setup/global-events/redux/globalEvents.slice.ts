import { createSlice } from '@reduxjs/toolkit';
import { IGlobalEventsSliceState } from './globalEvents.types';

const initialState: IGlobalEventsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const globalEventsSlice = createSlice({
  name: 'globalEvents',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentGlobalEventsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearGlobalEventsData: (state) => {
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
  currentGlobalEventsId,
  clearGlobalEventsData,
  setViewId,
  clearViewId
} = globalEventsSlice.actions;

export default globalEventsSlice.reducer;
