import { useGetCollegeInfoQuery } from '../redux/college-info.api';

export const useCollegeInfo = () => {
  const { data, isLoading, isError, refetch } = useGetCollegeInfoQuery();
  return {
    collegeInfo: data,
    isLoading,
    isError,
    refetch
  };
};