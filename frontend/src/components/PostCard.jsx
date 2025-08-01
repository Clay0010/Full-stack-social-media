import React, { useState } from "react";
import formatToLocalTime from "../lib/formatToLocalTime";
import TruncatedText from "./TruncatedText";
import { Edit, Heart, MessageCircleMore, Trash, Trash2 } from "lucide-react";
import useLikePost from "../hooks/useLikePost";
import useComment from "../hooks/useComment";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import useDeleteComment from "../hooks/useDeleteComment";
import useUpdateComment from "../hooks/useUpdateComment";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingText, setEditingText] = useState("");
  const navigate = useNavigate();

  const formattedDate = formatToLocalTime(post.createdAt);

  const authUser = useAuthUser();
  const userId = authUser.authUser.userId;

  const { likePostMutation } = useLikePost(post.id, userId);
  const { createCommentMutation } = useComment(post.id, comment);
  const { deleteCommentMutation } = useDeleteComment();
  const { updateCommentMutation } = useUpdateComment();

  const alreadyLiked = !!post.likes.find((like) => like.userId === userId);

  const likePost = () => {
    likePostMutation();
    toast.success(alreadyLiked ? "Post Unliked!" : "Post Liked!");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutation(
      { postId: post.id, content: comment },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Comment added!");
        },
        onError: () => toast.error("Failed to comment."),
      }
    );
  };

  const handleDeleteComment = (commentId, postId) => {
    deleteCommentMutation(
      { commentId, postId },
      {
        onSuccess: () => toast.success("Comment deleted successfully!"),
        onError: () => toast.error("Failed to delete comment."),
      }
    );
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setEditingText(comment.content);
  };

  const handleUpdateComment = () => {
    if (!editingText.trim()) return;
    updateCommentMutation(
      { commentId: editingComment.id, postId: post.id, content: editingText },
      {
        onSuccess: () => {
          toast.success("Comment updated successfully!");
          setEditingComment(null);
          setEditingText("");
        },
        onError: () => toast.error("Failed to update comment"),
      }
    );
  };

  const handleCloseEditModal = () => {
    setEditingComment(null);
    setEditingText("");
  };

  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="border border-neutral w-full m-4 mb-8 rounded-lg shadow-lg p-5">
      {/* user info */}
      <section className="flex items-center gap-3">
        <img
          src={post.user.profilePicUrl}
          alt="user"
          className="w-10 h-10 object-cover rounded-full hover:cursor-pointer"
          title="View Profile"
          onClick={() => handleShowProfile(post.user.id)}
        />
        <span>
          <h1
            className="text-sm font-bold hover:cursor-pointer hover:text-primary"
            title="View Profile"
            onClick={() => handleShowProfile(post.user.id)}
          >
            {post.user.username}
          </h1>
          <p className="text-xs font-light">{formattedDate}</p>
        </span>
      </section>

      {/* content */}
      <section className="pt-3 pl-1">
        <TruncatedText text={post.content} />
      </section>

      {/* images */}
      <section className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory hide-scrollbar py-4">
        {post.images?.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt="post"
            className="w-64 h-64 object-cover flex-shrink-0 rounded-lg snap-center"
          />
        ))}
      </section>

      {/* likes & comments */}
      <section className="flex items-center justify-between space-x-6 mt-1 px-4 pr-10">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <button onClick={likePost} className="hover:cursor-pointer">
              {alreadyLiked ? (
                <Heart className="text-red-500" fill="red" />
              ) : (
                <Heart />
              )}
            </button>
            <span>{post.likes.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowComment(!showComment)}
              className="hover:cursor-pointer"
            >
              <MessageCircleMore />
            </button>
            <span>{post.comments.length}</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm "
          onClick={() => navigate(`/post/${post.id}`)}
        >
          Show Details
        </button>
      </section>

      {/* comments */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <form
              className="w-full mx-auto mt-4 p-4 flex items-center gap-3 rounded-lg shadow-lg border border-neutral"
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

            <h1 className="pl-3 text-lg font-bold border-b-1 border-neutral pb-2 mt-3">
              Comments
            </h1>
            <div>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between gap-3 py-3 px-2 border-b border-neutral"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.user.profilePicUrl}
                      alt="user"
                      className="w-8 h-8 object-cover rounded-full flex-shrink-0 hover:cursor-pointer"
                      onClick={() => handleShowProfile(comment.user.id)}
                    />
                    <div className="max-w-[80%] break-words">
                      <h1
                        className="text-xs font-bold hover:cursor-pointer hover:text-primary"
                        onClick={() => handleShowProfile(comment.user.id)}
                      >
                        {comment.user.username}
                      </h1>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap flex flex-col items-end gap-2">
                    {userId === comment.user.id && (
                      <span className="flex items-center gap-2">
                        <Edit
                          className="size-4 hover:cursor-pointer hover:text-primary"
                          onClick={() => handleEditClick(comment)}
                        />
                        <Trash
                          className="size-4 hover:text-red-500 hover:cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`modal_${comment.id}`)
                              .showModal()
                          }
                        />
                        <dialog id={`modal_${comment.id}`} className="modal">
                          <div className="modal-box flex flex-col items-center">
                            <Trash2 className="size-8 text-red-500" />
                            <h1 className="text-lg font-semibold m-2">
                              Delete
                            </h1>
                            <h3 className="text-sm">
                              Are you sure you want to delete?
                            </h3>
                            <span>
                              <button
                                className="btn btn-md mt-4 bg-red-500 text-white"
                                onClick={() =>
                                  handleDeleteComment(comment.id, post.id)
                                }
                              >
                                Confirm
                              </button>
                            </span>
                          </div>
                          <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                        </dialog>
                      </span>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatToLocalTime(comment.createdAt)}
                    </p>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT COMMENT MODAL (State-driven) */}
      {editingComment && (
        <dialog open className="modal">
          <div className="modal-box">
            <h1 className="text-lg font-bold mb-3">Edit Comment</h1>
            <textarea
              className="textarea textarea-bordered w-full mb-3"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button className="btn btn-primary" onClick={handleUpdateComment}>
                Save
              </button>
              <button className="btn btn-ghost" onClick={handleCloseEditModal}>
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseEditModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default PostCard;
