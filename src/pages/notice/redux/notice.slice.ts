import { createSlice } from '@reduxjs/toolkit';
import { INoticeSliceState } from './types';

const initialState: INoticeSliceState = {
  edit: false,
  currentId: null,
  viewId: null,
  isStatusModal: false // if true opens status update modal else notice update modal
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
      state.isStatusModal = false;
    },
    setViewId: (state, { payload }) => {
      state.viewId = payload;
    },
    clearViewId: (state) => {
      state.viewId = null;
    },
    setIsStatusModal: (state, { payload }) => {
      state.isStatusModal = payload;
    }
  }
});

export const { setEdit, currentNoticeId, clearNoticeData, setViewId, clearViewId, setIsStatusModal } = noticeSlice.actions;

export default noticeSlice.reducer;
