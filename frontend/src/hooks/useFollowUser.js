import { useQueryClient, useMutation } from "@tanstack/react-query";
import { followUser } from "../lib/api";

const useFollowUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate: followUserMutation,
    error,
    isPending,
  } = useMutation({
    mutationFn: (userId) => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  return { followUserMutation, error, isPending };
};

export default useFollowUser;
