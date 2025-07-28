import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";

const useGetUser = (userId) => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return { userData, isLoading, isError, error };
};

export default useGetUser;
