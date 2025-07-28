import { createSlice } from '@reduxjs/toolkit';
import { IStudentClubsSliceState } from './types';

const initialState: IStudentClubsSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const studentClubsSlice = createSlice({
  name: 'StudentClubs',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentStudentClubsId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearStudentClubsData: (state) => {
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

export const { setEdit, currentStudentClubsId, clearStudentClubsData, setViewId, clearViewId } = studentClubsSlice.actions;

export default studentClubsSlice.reducer;
