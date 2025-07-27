import { RootState } from '@/libs/store';

export const campusEventsState = (state: RootState) => {
  return state?.campusEvents;
};
