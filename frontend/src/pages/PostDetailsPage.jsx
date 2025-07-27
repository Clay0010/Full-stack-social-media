import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGetPostDetails from "../hooks/useGetPostDetails";
import useComment from "../hooks/useComment";
import toast from "react-hot-toast";

const PostDetailsPage = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState("");

  const { postDetails, error, isLoading } = useGetPostDetails(postId);

  // Always call hooks unconditionally
  const { createCommentMutation } = useComment(postId);

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

  return (
    <div className="w-full mx-auto bg-base-200 p-30">
      <div>
        {/* user information */}
        <span className="flex items-center gap-2 mb-5">
          <img
            src={postDetails.post.user.profilePicUrl}
            alt="user's image"
            className="size-10 rounded-full"
          />
          <span>
            <h1 className="text-sm font-bold">
              {postDetails.post.user.username}
            </h1>
            <p className="text-xs text-gray-500">
              {postDetails.post.user.email}
            </p>
          </span>
        </span>

        {/* post content */}
        <div>
          <p className="text-lg text-white">{postDetails.post.content}</p>
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
                className="bg-base-300 p-5 rounded-lg mb-5"
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
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default PostDetailsPage;
