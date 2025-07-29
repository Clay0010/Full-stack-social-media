import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSuggestions } from "../lib/api";

const usegetSuggestions = () => {
  const {
    data: suggestedUsers,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestions,
    refetchOnWindowFocus: false,
  });

  return { suggestedUsers, error, isLoading };
};

export default usegetSuggestions;
