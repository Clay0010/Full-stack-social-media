import prisma from "../prismaClient.js";

export const createComment = async (req, res) => {
  const { content } = req.body;
  const postId = parseInt(req.params.postId, 10);

  const userId = req.user.userId; // userId from the authenticated user

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId, // Use the userId from the authenticated user
      },
    });

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.log("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCommentByPostAuthor = async (req, res) => {
  const userId = req.user.userId;
  const commentId = parseInt(req.params.commentId, 10); // Assuming commentId is part of the route
  const postId = parseInt(req.params.postId, 10); // Assuming postId is part of the route

  if (!postId || !commentId || isNaN(postId) || isNaN(commentId)) {
    return res
      .status(400)
      .json({ error: "Post ID and Comment ID are required" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCommentByPostAuthor = async (req, res) => {
  const userId = req.user.userId;
  const commentId = parseInt(req.params.commentId, 10);
  const postId = parseInt(req.params.postId, 10); // Assuming postId is part of the route
  const { content } = req.body;

  if (!commentId || !postId || isNaN(postId) || isNaN(commentId)) {
    return res
      .status(400)
      .json({ error: "Post ID and Comment ID are required" });
  }

  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the userId matches
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }

    // Check if the postId matches
    if (comment.postId !== postId) {
      return res.status(400).json({ error: "Post ID does not match" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: { content },
    });

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.log("Error updating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
