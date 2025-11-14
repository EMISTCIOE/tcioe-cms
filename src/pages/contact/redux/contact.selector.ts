import { RootState } from '@/libs/store';

export const selectPhoneNumberState = (state: RootState) => state.phoneNumber;
export const selectSelectedPhoneNumberId = (state: RootState) => state.phoneNumber.selectedPhoneNumberId;
export const selectIsEditModalOpen = (state: RootState) => state.phoneNumber.isEditModalOpen;
export const selectIsDetailModalOpen = (state: RootState) => state.phoneNumber.isDetailModalOpen;
export const selectIsCreateModalOpen = (state: RootState) => state.phoneNumber.isCreateModalOpen;
