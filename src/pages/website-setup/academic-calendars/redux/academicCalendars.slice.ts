import { createSlice } from '@reduxjs/toolkit';
import { IAcademicCalendarsSliceState } from './types';

const initialState: IAcademicCalendarsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const academicCalendarsSlice = createSlice({
  name: 'AcademicCalendars',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentAcademicCalendarsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearAcademicCalendarsData: (state) => {
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

export const { setEdit, currentAcademicCalendarsId, clearAcademicCalendarsData, setViewId, clearViewId } = academicCalendarsSlice.actions;

export default academicCalendarsSlice.reducer;
