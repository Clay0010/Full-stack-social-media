import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../lib/api";

const useComment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createCommentMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ postId, content }) => createComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });

      // Optionally invalidate specific post:
      // queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });

  return { createCommentMutation, error, isPending };
};

export default useComment;
