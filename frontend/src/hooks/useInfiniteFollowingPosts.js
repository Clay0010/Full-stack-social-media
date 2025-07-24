import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const fetchFollowingPosts = async ({ pageParam = null, queryKey }) => {
  const userId = queryKey[1];
  const res = await axiosInstance.get(`/posts/following/${userId}`, {
    params: {
      limit: 5,
      cursor: pageParam,
    },
  });
  return res.data;
};

export default function useInfiniteFollowingPosts(userId) {
  return useInfiniteQuery({
    queryKey: ["followingPosts", userId],
    queryFn: fetchFollowingPosts,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
