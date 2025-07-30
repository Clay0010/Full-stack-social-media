import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../lib/api";

const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { mutate: deletePostMutation, error } = useMutation({
    mutationFn: ({ postId }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });
    },
  });

  return { deletePostMutation, error };
};

export default useDeletePost;
