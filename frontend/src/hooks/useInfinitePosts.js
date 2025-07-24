import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const fetchPosts = async ({ pageParam = null }) => {
  const res = await axiosInstance.get("/posts", {
    params: {
      limit: 10,
      cursor: pageParam,
    },
  });

  return res.data;
};

export default function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
