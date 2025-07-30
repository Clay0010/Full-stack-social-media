import React from "react";
import usegetSuggestions from "../hooks/usegetSuggestions";
import useFollowUser from "../hooks/useFollowUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Suggestions = () => {
  const navigate = useNavigate();
  const {
    followUserMutation,
    error: followUserError,
    isPending,
  } = useFollowUser();

  const { suggestedUsers, error, isLoading } = usegetSuggestions();

  if (isLoading) return <h1>Loading suggestions...</h1>;
  if (error) return <h1>Error loading suggestions: {error.message}</h1>;
  if (!suggestedUsers || suggestedUsers.length === 0) {
    return <h1>No suggestions available</h1>;
  }

  // console.log(suggestedUsers.suggestions);

  const handleFollowUser = (userId) => {
    followUserMutation(userId);
    if (followUserError) {
      return toast.error("Error following user");
    }
    if (isPending) {
      console.log("Following user, please wait...");
    }
    toast.success("users followed successfully");
  };

  return (
    <div className="pt-8 px-5 ">
      <h1 className="mb-3 uppercase font-semibold text-md opacity-75 tracking-wider">
        Suggestions
      </h1>
      <div className="flex flex-col gap-2">
        {/* this could be a component */}
        {suggestedUsers.suggestions.map((user) => {
          return (
            <div
              className="flex justify-between px-3 py-3 w-[95%] m-auto rounded-xl bg-base-200"
              key={user.id}
            >
              <span className="flex justify-start items-center gap-3">
                <img
                  src={user.profilePicUrl || "https://via.placeholder.com/150"}
                  alt="image"
                  className="h-8 w-8 rounded-full hover:cursor-pointer"
                  onClick={() => navigate(`/profile/${user.id}`)}
                />
                <h3
                  className="text-sm font-semibold hover:cursor-pointer hover:underline"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.username}
                </h3>
              </span>
              <button
                className="btn btn-primary text-sm btn-sm"
                onClick={() => handleFollowUser(user.id)}
              >
                Follow
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suggestions;
