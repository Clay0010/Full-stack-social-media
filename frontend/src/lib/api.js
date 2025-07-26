import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getUserAuth", error);
    return null;
  }
};

export const signUp = async (signupData) => {
  const res = await axiosInstance.post("/auth/register", signupData);
  return res.data;
};

export const login = async (signInData) => {
  const res = await axiosInstance.post("/auth/login", signInData);
  return res.data;
};

export const getUserProfile = async (userId) => {
  const res = await axiosInstance.get(`/users/${userId}`);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const fetchAllPosts = async () => {
  const res = await axiosInstance.get("/posts");
  return res.data;
};

export const fetchFollowingPosts = async (userId) => {
  const res = await axiosInstance.get(`/posts/following/${userId}`);
  return res.data;
};

export const likePost = async (postId) => {
  const res = await axiosInstance.post(`/posts/${postId}/like`);
  return res.data;
};

export const createComment = async (postId, comment) => {
  const res = await axiosInstance.post(`/comments/${postId}`, {
    content: comment,
  });

  return res.data;
};

export const deleteComment = async (commentId, postId) => {
  const res = await axiosInstance.delete(
    `/comments/${postId}/comment/${commentId}`
  );
  return res.data;
};

export const updateComment = async (commentId, postId, content) => {
  const res = await axiosInstance.put(
    `/comments/${postId}/comment/${commentId}`,
    {
      content,
    }
  );
  return res.data;
};

export const followUser = async (userId) => {
  const res = await axiosInstance.post(`users/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId) => {
  const res = await axiosInstance.post(`users/${userId}/unfollow`);
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await axiosInstance.patch("/users/me", profileData);
  return res.data;
};
