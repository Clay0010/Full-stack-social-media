import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../lib/api";

const useLikePost = (postId, userId) => {
  const queryClient = useQueryClient();

  const {
    mutate: likePostMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { likePostMutation, error, isPending };
};

export default useLikePost;
