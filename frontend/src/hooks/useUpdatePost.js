import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePost } from "../lib/api";

const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updatePostMutation,
    error,
    isLoading,
  } = useMutation({
    mutationFn: ({ postId, content }) => updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postDetails"] });
    },
  });

  return { updatePostMutation, error, isLoading };
};

export default useUpdatePost;
