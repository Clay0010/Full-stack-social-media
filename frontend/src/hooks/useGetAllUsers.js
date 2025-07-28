import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../lib/api";

const useGetAllUsers = () => {
  const allUsers = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    retry: false,
  });

    return {
        isLoading: allUsers.isLoading,
        allUsers: allUsers.data?.users || [],
        error: allUsers.error,
    };
}

export default useGetAllUsers