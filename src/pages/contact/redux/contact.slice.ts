import { createSlice } from '@reduxjs/toolkit';

export interface IPhoneNumberState {
  selectedPhoneNumberId: string | null;
  isEditModalOpen: boolean;
  isDetailModalOpen: boolean;
  isCreateModalOpen: boolean;
}

const initialState: IPhoneNumberState = {
  selectedPhoneNumberId: null,
  isEditModalOpen: false,
  isDetailModalOpen: false,
  isCreateModalOpen: false
};

export const phoneNumberSlice = createSlice({
  name: 'phoneNumber',
  initialState,
  reducers: {
    setSelectedPhoneNumberId: (state, action) => {
      state.selectedPhoneNumberId = action.payload;
    },
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedPhoneNumberId = null;
    },
    openDetailModal: (state) => {
      state.isDetailModalOpen = true;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedPhoneNumberId = null;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    }
  }
});

export const {
  setSelectedPhoneNumberId,
  openEditModal,
  closeEditModal,
  openDetailModal,
  closeDetailModal,
  openCreateModal,
  closeCreateModal
} = phoneNumberSlice.actions;

export default phoneNumberSlice.reducer;
