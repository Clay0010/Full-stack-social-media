import React from "react";
import formatToLocalTime from "../lib/formatToLocalTime";
import { Edit, Trash, Trash2 } from "lucide-react";

const CommentItem = ({
  comment,
  onEdit,
  onDelete,
  userId,
  postId,
  onShowProfile,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-2 border-b border-neutral">
      <div className="flex items-start gap-3">
        <img
          src={comment.user.profilePicUrl}
          alt="user"
          className="w-8 h-8 object-cover rounded-full flex-shrink-0 hover:cursor-pointer"
          onClick={() => onShowProfile(comment.user.id)}
        />
        <div className="max-w-[80%] break-words">
          <h1
            className="text-xs font-bold hover:cursor-pointer hover:text-primary"
            onClick={() => onShowProfile(comment.user.id)}
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
              onClick={() => onEdit(comment)}
            />
            <Trash
              className="size-4 hover:text-red-500 hover:cursor-pointer"
              onClick={() => onDelete(comment.id, postId)}
            />
          </span>
        )}
        <p className="text-xs text-gray-500">
          {formatToLocalTime(comment.createdAt)}
        </p>
      </span>
    </div>
  );
};

export default React.memo(CommentItem);
