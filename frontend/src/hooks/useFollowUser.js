import { useQueryClient, useMutation } from "@tanstack/react-query";
import { followUser } from "../lib/api";

const useFollowUser = (userId) => {
  const queryClient = useQueryClient();
  const {
    mutate: followUserMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return { followUserMutation, error, isPending };
};

export default useFollowUser;
