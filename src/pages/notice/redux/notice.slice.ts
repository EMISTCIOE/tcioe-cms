import { createSlice } from '@reduxjs/toolkit';
import { INoticeSliceState } from './types';

const initialState: INoticeSliceState = {
  edit: false,
  currentId: null,
  viewId: null
};

export const noticeSlice = createSlice({
  name: 'Notice',
  initialState,
  reducers: {
    setEdit: (state, { payload }) => {
      state.edit = payload;
    },
    currentNoticeId: (state, { payload }) => {
      state.currentId = payload;
    },
    clearNoticeData: (state) => {
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

export const { setEdit, currentNoticeId, clearNoticeData, setViewId, clearViewId } = noticeSlice.actions;

export default noticeSlice.reducer;
