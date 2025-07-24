import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../lib/api";

const useUpdateComment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateCommentMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ commentId, postId, content }) =>
      updateComment(commentId, postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });

      // Optionally invalidate specific post:
      // queryClient.invalidateQueries({ queryKey: ["post", variables.postId] })
    },
  });

  return { updateCommentMutation, error, isPending };
};

export default useUpdateComment;
