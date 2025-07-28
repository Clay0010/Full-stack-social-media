import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import useFollowUser from "../hooks/useFollowUser";
import useUnfollowUser from "../hooks/useUnfollowUser";
import useUpdateProfile from "../hooks/useUpdateProfile";
import useGetUser from "../hooks/useGetUser";

import LetterGlitch from "../components/LetterGlitch";
import TiltedCard from "../components/TiltedCard";
import formatToLocalTime from "../lib/formatToLocalTime";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams();
  const authUser = useAuthUser();
  const finalUserId = routeUserId || authUser.authUser.userId;

  const { userData, isLoading, error } = useGetUser(finalUserId);
  const { followUserMutation } = useFollowUser(finalUserId);
  const { unfollowUserMutation } = useUnfollowUser(finalUserId);
  const { updateProfileMutation } = useUpdateProfile();

  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    profilePicUrl: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (userData?.user) {
      setEditForm({
        username: userData.user.username,
        bio: userData.user.bio || "",
        profilePicUrl:
          userData.user.profilePicUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      });
    }
  }, [userData]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!userData?.user) return <p>No user found</p>;

  const profile = userData.user;
  const isOwner = authUser.authUser.userId === profile.id;
  const isFollowing = profile.followers.some(
    (f) => f.id === authUser.authUser.userId
  );

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUserMutation(profile.id);
      toast.success("Unfollowed User Successfully");
    } else {
      followUserMutation(profile.id);
      toast.success("Followed User Successfully");
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation(editForm);
    toast.success("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="h-screen w-[90%] mx-auto overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="mx-40 mt-20 flex justify-around items-center shadow-lg rounded-4xl relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <LetterGlitch glitchSpeed={20} centerVignette outerVignette smooth>
            BACKGROUND TEXT
          </LetterGlitch>
        </div>
        <img
          src={profile.profilePicUrl}
          alt="user"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
          }}
          className="h-40 w-40 object-cover rounded-full z-10"
        />
        <div className="pt-10 z-10">
          <div className="flex items-center justify-between gap-10">
            <span>
              <h1 className="font-bold text-xl text-primary">
                {profile.username}
              </h1>
              <p className="opacity-70 text-sm">{profile.email}</p>
            </span>

            {isOwner ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <button className="btn btn-secondary btn-sm">
              Copy Profile Link
            </button>
          </div>

          {/* Stats */}
          <div className="mt-5 flex items-center justify-between">
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{profile.posts?.length || 0}</h1>
              <p className="text-md">Posts</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{profile.followers?.length || 0}</h1>
              <p className="text-md">Followers</p>
            </span>
            <span className="flex gap-1 items-center">
              <h1 className="font-bold">{profile.following?.length || 0}</h1>
              <p className="text-md">Following</p>
            </span>
          </div>

          <div className="my-10">
            <span className="text-sm">{profile.bio || "No Bio Provided"}</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-15 my-5">
        <h1 className="font-semibold text-center text-primary text-2xl">
          Your Posts
        </h1>
        <hr className="w-[60%] mx-auto mt-2 text-neutral mb-8" />
        {profile.posts?.length > 0 ? (
          <div className="grid grid-cols-3 gap-10">
            {profile.posts.map((post) => (
              <div
                key={post.id}
                className="w-full h-full"
                onClick={() => navigate(`/post/${post.id}`)}
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
                  showTooltip
                  displayOverlayContent
                  overlayContent={formatToLocalTime(post.createdAt)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div>You Have No Posts</div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editing}
        onClose={() => setEditing(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
