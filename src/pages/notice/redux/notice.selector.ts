import { RootState } from '@/libs/store';

export const noticeState = (state: RootState) => {
  return state?.notice;
};
