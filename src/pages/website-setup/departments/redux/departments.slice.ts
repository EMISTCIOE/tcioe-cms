import { createSlice } from '@reduxjs/toolkit';
import { IDepartmentSliceState } from './types';

const initialState: IDepartmentSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentDepartmentId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearDepartmentData: (state) => {
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

export const { setEdit, currentDepartmentId, clearDepartmentData, setViewId, clearViewId } = departmentSlice.actions;

export default departmentSlice.reducer;
