import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPostDetails } from "../lib/api";

const useGetPostDetails = (postId) => {
  const {
    data: postDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postDetails"],
    queryFn: () => fetchPostDetails(postId),
  });

  return { postDetails, isLoading, error };
};

export default useGetPostDetails;
