import { useQueryClient, useMutation } from "@tanstack/react-query";
import { unfollowUser } from "../lib/api";

const useUnfollowUser = (userId) => {
  const queryClient = useQueryClient();
  const {
    mutate: unfollowUserMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return { unfollowUserMutation, error, isPending };
};

export default useUnfollowUser;
