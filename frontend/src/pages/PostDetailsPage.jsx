import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetPostDetails from "../hooks/useGetPostDetails";
import useComment from "../hooks/useComment";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

import useUpdatePost from "../hooks/useUpdatePost";
import useDeletePost from "../hooks/useDeletePost";
import { motion } from "motion/react";
import formatToLocalTime from "../lib/formatToLocalTime";
import { useNavigate } from "react-router-dom";

const PostDetailsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const authUser = useAuthUser();
  const userId = authUser.authUser.userId;
  const { postDetails, error, isLoading } = useGetPostDetails(postId);
  const { createCommentMutation } = useComment(postId);

  const { updatePostMutation } = useUpdatePost();

  const { deletePostMutation } = useDeletePost();

  if (isLoading) return <h1>Loading post details...</h1>;
  if (error) return <h1>Error loading post details: {error.message}</h1>;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    createCommentMutation(
      { postId: postDetails.post.id, content: comment },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Comment added!");
        },
        onError: () => toast.error("Failed to comment."),
      }
    );
  };

  const handleEditClick = () => {
    setEditedContent(postDetails.post.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editedContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    // updatePostMutation.mutate(editedContent);
    updatePostMutation(
      {
        content: editedContent,
        postId: postDetails.post.id,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Post updated successfully");
        },
        onError: () => toast.error("Failed to update post"),
      }
    );
  };

  const handleDeletePost = (postId) => {
    console.log(postId);

    deletePostMutation(
      { postId },
      {
        onSuccess: () => {
          toast.success("Post deleted successfully");

          setTimeout(() => {
            window.location.href = "/profile";
          }, 500);
        },
        onError: () => toast.error("Failed to delete post"),
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-[80%] mx-auto shadow-lg p-30 hide-scrollbar"
    >
      <div>
        {/* user information */}
        <span className="flex items-center justify-between gap-2 mb-5">
          <div
            className="flex items-center gap-3 hover:cursor-pointer"
            onClick={() => navigate(`/profile/${postDetails.post.user.id}`)}
          >
            <img
              src={postDetails.post.user.profilePicUrl}
              alt="user's image"
              className="size-11 rounded-full"
            />
            <span>
              <h1 className="text- font-bold">
                {postDetails.post.user.username}
              </h1>
              <p className="text-xs text-gray-500">
                {postDetails.post.user.email}
              </p>
            </span>
          </div>
          <div>
            {postDetails.post.userId === userId && !isEditing && (
              <button className="btn btn-secondary" onClick={handleEditClick}>
                Edit Post
              </button>
            )}

            {postDetails.post.userId === userId && (
              <button
                className="btn btn-error ml-2"
                onClick={() => {
                  handleDeletePost(postDetails.post.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </span>

        {/* post content */}
        <div>
          {isEditing ? (
            <div>
              <textarea
                className="textarea textarea-bordered w-full mb-3"
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                  disabled={updatePostMutation.isLoading}
                >
                  {updatePostMutation.isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleCancelEdit}
                  disabled={updatePostMutation.isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-lg text-white">{postDetails.post.content}</p>
          )}
        </div>

        {/* post images */}
        <section>
          <div className="carousel rounded-box h-100 gap-10 mt-10 w-full">
            {postDetails.post.images.map((image) => (
              <div className="carousel-item h-full" key={image.id}>
                <img
                  src={image.url}
                  alt="post"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>

        {/* post comments */}
        <section>
          {/* create comment form */}
          <form
            className="w-full mx-auto mt-10 p-4 flex items-center gap-3 rounded-lg shadow-lg border border-neutral"
            onSubmit={handleSubmitComment}
          >
            <input
              type="text"
              placeholder="Leave a comment"
              className="input input-neutral w-[80%]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-secondary p-2" type="submit">
              Comment
            </button>
          </form>

          <h1 className="text-2xl font-bold mt-6 mb-5">Comments</h1>
          {postDetails.post.comments.length > 0 ? (
            postDetails.post.comments.map((comment) => (
              <div
                key={comment?.id}
                className="bg-base-300 p-3 rounded-lg mb-4 flex justify-between items-center"
              >
                <span className="flex items-center gap-2 mb-3">
                  <img
                    src={comment?.user.profilePicUrl}
                    alt="user's image"
                    className="size-10 rounded-full"
                  />
                  <span>
                    <h1 className="text-sm font-bold">
                      {comment?.user.username}
                    </h1>
                    <p className="text-md text-gray-500">{comment.content}</p>
                  </span>
                </span>
                <span className="opacity-75 text-xs">
                  {formatToLocalTime(comment.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default PostDetailsPage;
