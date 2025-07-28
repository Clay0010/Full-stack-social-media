import UserCard from "./UserCard";
import useAuthUser from "../hooks/useAuthUser";
import { getUserProfile } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import useGetUser from "../hooks/useGetUser";

const Sidebar = () => {
  const user = useAuthUser();
  const userId = user?.authUser?.userId;

  if (!userId) {
    return <p>Loading user info...</p>;
  }

  const { userData, isLoading, isError } = useGetUser(userId);

  if (isLoading) {
    return <p>Loading user data...</p>;
  }
  if (isError) {
    return <p>Error loading user data: {error.message}</p>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto pt-8 flex flex-col gap-2 items-center justify-start hide-scrollbar">
      <h1 className="font-bold text-lg  tracking-wider w-[75%]">Following</h1>
      <div className="max-h-[40%] overflow-y-auto hide-scrollbar w-[75%]">
        {userData.user.following.length === 0 ? (
          <p className="text-center">You Don't Follow Anyone</p>
        ) : (
          userData.user.following.map((f) => {
            return <UserCard key={f.id} data={f} />;
          })
        )}
      </div>
      {/* asdasdasd */}
      <h1 className="font-bold text-lg  tracking-wider w-[75%]">Followers</h1>
      <div className="max-h-[45%] overflow-y-auto hide-scrollbar w-[75%]">
        {userData.user.followers.length === 0 ? (
          <p className="text-center">You Have No Followers</p>
        ) : (
          userData.user.followers.map((f) => {
            return <UserCard key={f.id} data={f} />;
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
