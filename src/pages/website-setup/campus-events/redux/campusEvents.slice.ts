import { createSlice } from '@reduxjs/toolkit';
import { ICampusEventsSliceState } from './types';

const initialState: ICampusEventsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const campusEventsSlice = createSlice({
  name: 'CampusEvents',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentCampusEventsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearCampusEventsData: (state) => {
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

export const { setEdit, currentCampusEventsId, clearCampusEventsData, setViewId, clearViewId } = campusEventsSlice.actions;

export default campusEventsSlice.reducer;
