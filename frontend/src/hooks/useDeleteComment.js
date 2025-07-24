import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../lib/api";

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteCommentMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ commentId, postId }) => deleteComment(commentId, postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });

      // Optionally invalidate specific post:
      // queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });

  return { deleteCommentMutation, error, isPending };
};

export default useDeleteComment;
