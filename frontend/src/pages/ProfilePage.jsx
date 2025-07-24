import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";
import LetterGlitch from "../components/LetterGlitch";

const ProfilePage = () => {
  const authUser = useAuthUser();
  const userId = authUser.authUser.userId;
  //   console.log(user.authUser.userId);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId, // only fetch if userId is truthy
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  console.log(user);

  return (
    <div className="h-screen w-[90%] mx-auto overflow-y-auto hide-scrollbar">
      {/* <LetterGlitch
            glitchSpeed={20}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
          /> */}

      <div className="mx-40 my-10 flex justify-around items-center shadow-lg rounded-4xl relative overflow-hidden">
        {/* leftSide - profile image */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <LetterGlitch
            glitchSpeed={20}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
          >
            {/* Large background-like glitchy text */}
            BACKGROUND TEXT
          </LetterGlitch>
        </div>
        <img
          src={user.user.profilePicUrl}
          alt="user"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
          }}
          className="h-40 w-40 object-cover rounded-full z-10"
        />

        <div className="pt-10 z-10">
          {/* right side - user info  */}
          <div className="flex items-center justify-between gap-10">
            <span className="">
              <h1 className="font-bold text-xl text-primary">
                {user.user.username}
              </h1>
              <p className="opacity-70 text-sm">{user.user.email}</p>
            </span>
            <button className="btn btn-primary btn-sm">Edit Profile</button>
            <button className="btn btn-secondary btn-sm">
              Copy Profile Link
            </button>
          </div>

          {/* user followers - following - posts  */}
          <div className="mt-5 flex items-center justify-between">
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{user.user.posts.length}</h1>
              <p className="text-md">Posts</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{user.user.followers.length}</h1>
              <p className="text-md">Followers</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{user.user.following.length}</h1>
              <p className="text-md">Following</p>
            </span>
          </div>

          {/* user's bio  */}

          <div className="my-10">
            {user.user.bio !== "" ? (
              <span className="text-sm">{user.user.bio}</span>
            ) : (
              <span className="text-sm">No Bio Provided</span>
            )}
          </div>
        </div>
      </div>

      {/* user's posts */}

      <div className="mx-15 my-5 ">
        <h1 className="font-semibold text-center text-primary text-2xl">
          Your Posts
        </h1>
        <hr className="w-[60%] mx-auto mt-2 text-neutral mb-8" />
        <div>
          {user.user.posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-10">
              {user.user.posts.map((post) => {
                return (
                  <div
                    className="border border-neutral  w-[26vw] h-[40vh] rounded-lg shadow-xl overflow-hidden "
                    key={post.id}
                  >
                    {post.images.length > 0 ? (
                      <img
                        src={post.images[0]?.url}
                        className="w-full h-full object-cover rounded-lg "
                      />
                    ) : (
                      //   <h1>{post.images[0].url}</h1>
                      <p>post has no images</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>You Have No Posts</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
