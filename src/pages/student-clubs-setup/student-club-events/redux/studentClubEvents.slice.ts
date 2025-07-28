import { createSlice } from '@reduxjs/toolkit';
import { IStudentClubEventsSliceState } from './types';

const initialState: IStudentClubEventsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const studentClubEventsSlice = createSlice({
  name: 'StudentClubEvents',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentStudentClubEventsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearStudentClubEventsData: (state) => {
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

export const { setEdit, currentStudentClubEventsId, clearStudentClubEventsData, setViewId, clearViewId } = studentClubEventsSlice.actions;

export default studentClubEventsSlice.reducer;
