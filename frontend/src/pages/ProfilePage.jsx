import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";
import LetterGlitch from "../components/LetterGlitch";
import TiltedCard from "../components/TiltedCard";
import formatToLocalTime from "../lib/formatToLocalTime";
import { useParams } from "react-router-dom";
import useFollowUser from "../hooks/useFollowUser";
import toast from "react-hot-toast";
import useUnfollowUser from "../hooks/useUnfollowUser";
import { useEffect, useState } from "react";
import useUpdateProfile from "../hooks/useUpdateProfile";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePicUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    bio: "",
    followers: [],
    following: [],
    posts: [],
  });
  const navigate = useNavigate();

  const { updateProfileMutation } = useUpdateProfile();

  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    profilePicUrl: "",
  });
  const [editing, setEditing] = useState(false);

  const { userId: routeUserId } = useParams();
  const authUser = useAuthUser();

  const finalUserId = routeUserId || authUser.authUser.userId;

  const { followUserMutation } = useFollowUser(finalUserId);
  const { unfollowUserMutation } = useUnfollowUser(finalUserId);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", finalUserId],
    queryFn: () => getUserProfile(finalUserId),
    enabled: !!finalUserId,
  });

  useEffect(() => {
    if (user?.user) {
      setUserData(user.user);
      setEditForm({
        username: user.user.username,
        bio: user.user.bio || "",
        profilePicUrl:
          user.user.profilePicUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      });
    }
  }, [user]);

  if (!userData) return <p>Loading profile data...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const isFollowing = userData.followers.some(
    (f) => f.id === authUser.authUser.userId
  );

  const handleFollowUser = (userId) => {
    followUserMutation(userId);
    toast.success("Followed User Successfully");
  };

  const handleUnfollowUser = (userId) => {
    unfollowUserMutation(userId);
    toast.success("Unfollowed User Successfully");
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveProfile = () => {
    setUserData((prev) => ({
      ...prev,
      username: editForm.username,
      bio: editForm.bio,
      profilePicUrl: editForm.profilePicUrl,
    }));
    updateProfileMutation({
      username: editForm.username,
      bio: editForm.bio,
      profilePicUrl: editForm.profilePicUrl,
    });

    toast.success("Profile updated successfully!");
    setEditing(false);
  };

  const handleOpenPostDetails = (postId) => {
    console.log(`Opening post details for post ID: ${postId}`);

    navigate(`/post/${postId}`);
  };

  return (
    <div className="h-screen w-[90%] mx-auto overflow-y-auto hide-scrollbar">
      <div className="mx-40 mt-20 flex justify-around items-center shadow-lg rounded-4xl relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <LetterGlitch
            glitchSpeed={20}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
          >
            BACKGROUND TEXT
          </LetterGlitch>
        </div>
        <img
          src={userData.profilePicUrl}
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
          <div className="flex items-center justify-between gap-10">
            <span>
              <h1 className="font-bold text-xl text-primary">
                {userData.username}
              </h1>
              <p className="opacity-70 text-sm">{userData.email}</p>
            </span>

            {authUser.authUser.userId !== userData.id ? (
              isFollowing ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUnfollowUser(userData.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleFollowUser(userData.id)}
                >
                  Follow
                </button>
              )
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            )}
            <button className="btn btn-secondary btn-sm">
              Copy Profile Link
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{userData?.posts?.length}</h1>
              <p className="text-md">Posts</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{userData?.followers?.length}</h1>
              <p className="text-md">Followers</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{userData?.following?.length}</h1>
              <p className="text-md">Following</p>
            </span>
          </div>

          <div className="my-10">
            {userData.bio !== "" ? (
              <span className="text-sm">{userData.bio}</span>
            ) : (
              <span className="text-sm">No Bio Provided</span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-15 my-5">
        <h1 className="font-semibold text-center text-primary text-2xl">
          Your Posts
        </h1>
        <hr className="w-[60%] mx-auto mt-2 text-neutral mb-8" />
        <div>
          {userData.posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-10">
              {userData.posts.map((post) => (
                <div
                  key={post.id}
                  className="w-full h-full"
                  onClick={() => handleOpenPostDetails(post.id)}
                >
                  <TiltedCard
                    imageSrc={post.images[0]?.url}
                    altText="Post"
                    captionText="Show Details"
                    containerHeight="300px"
                    containerWidth="300px"
                    imageHeight="300px"
                    imageWidth="300px"
                    rotateAmplitude={12}
                    scaleOnHover={1.2}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={formatToLocalTime(post.createdAt)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>You Have No Posts</div>
          )}
        </div>
      </div>

      {editing && (
        <dialog open className="modal">
          <div className="modal-box">
            <input
              type="text"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              className="input input-neutral w-full mb-3"
              placeholder="Username"
            />
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              className="textarea textarea-neutral w-full mb-3"
              placeholder="Bio"
            />
            <input
              type="text"
              value={editForm.profilePicUrl}
              onChange={(e) =>
                setEditForm({ ...editForm, profilePicUrl: e.target.value })
              }
              className="input input-neutral w-full mb-3"
              placeholder="Profile Picture URL"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleSaveProfile}>
                Save
              </button>
              <button className="btn" onClick={() => setEditing(false)}>
                Close
              </button>
            </div>
          </div>

          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setEditing(false)}
          />
        </dialog>
      )}
    </div>
  );
};

export default ProfilePage;
