import React, { useEffect, useRef, useState } from "react";
import CreatePost from "../components/CreatePost";
import useAuthUser from "../hooks/useAuthUser";
import useInfinitePosts from "../hooks/useInfinitePosts";
import useInfiniteFollowingPosts from "../hooks/useInfiniteFollowingPosts";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [filter, setFilter] = useState("all");
  const user = useAuthUser();
  const userId = user?.authUser?.userId;
  // console.log(userId);

  if (filter === "following" && !userId) {
    return <p>Loading user info...</p>;
  }

  // Select hook based on filter
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    filter === "all" ? useInfinitePosts() : useInfiniteFollowingPosts(userId);

  const loaderRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="mt-5">
      <CreatePost />
      <div className="flex space-x-10 justify-center items-center">
        <button
          onClick={() => setFilter("all")}
          className={`cursor-pointer ${filter === "all" ? "font-bold" : ""}`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter("following")}
          className={`cursor-pointer ${filter === "following" ? "font-bold" : ""}`}
        >
          Following
        </button>
      </div>

      <div className="max-w-2xl w-full mx-auto px-4">
        {isFetching && posts.length === 0 ? (
          <p>Loading Posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No posts to show.</p>
        ) : (
          posts.map((post) => <PostCard post={post} key={post.id} />)
        )}
        <div ref={loaderRef} className="h-10 text-center mt-3">
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Scroll to load more"
              : "No more posts"}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
