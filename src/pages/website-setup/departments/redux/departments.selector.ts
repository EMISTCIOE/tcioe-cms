import { RootState } from '@/libs/store';

export const departmentState = (state: RootState) => {
  return state?.departments;
};
