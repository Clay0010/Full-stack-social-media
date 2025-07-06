import prisma from "../prismaClient.js";
import { isValidImageUrl } from "../utils/isValidImageUrl.js";



export const getUserPosts = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        imageUrl: true,
        userId: true,
        comments: true,
        likes: true,
      },
    });

    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  const { content, imageUrl } = req.body;
  const userId = req.user.userId; // userId was stored in req.user by the authenticate middleware (token verification)

  if (!content) {
    return res.status(400).json({ error: "Post content is required" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId, // Use the userId from the authenticated user
        ...(imageUrl && { imageUrl }), // only include imageUrl if truthy
      },
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.log("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.userId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // If the like already exists, remove it (unlike)
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return res.status(200).json({ success: true, message: "Post unliked" });
    }

    // If the like does not exist, create it (like)
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return res.status(201).json({ success: true, message: "Post liked" });
  } catch (error) {
    console.log("Error liking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSinglePost = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.userId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    await prisma.comment.deleteMany({
      where: { postId },
    });

    await prisma.like.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { content, imageUrl } = req.body;
  const userId = req.user.userId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  if (!content && !imageUrl) {
    return res.status(400).json({ error: "Content or image URL is required" });
  }

  if (imageUrl && !isValidImageUrl(imageUrl)) {
    return res.status(400).json({ error: "Invalid image URL format" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content && { content }),
        ...(imageUrl && { imageUrl }),
      },
    });

    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    console.log("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
