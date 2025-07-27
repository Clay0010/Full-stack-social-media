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

export const getFollowingPosts = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { limit = 5, cursor } = req.query;
  const cursorId = cursor ? parseInt(cursor, 10) : undefined;

  const take = parseInt(limit);

  try {
    const relations = await prisma.userRelation.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = relations.map((r) => r.followingId);

    if (followingIds.length === 0) {
      return res
        .status(200)
        .json({ success: true, posts: [], nextCursor: null });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      take: take + 1, // get one extra to check if more posts exist
      ...(cursorId && {
        skip: 1, // skip the cursor itself
        cursor: {
          id: cursorId,
        },
      }),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        images: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    let nextCursor = null;
    if (posts.length > take) {
      const nextItem = posts.pop(); // remove the extra post
      nextCursor = nextItem.id;
    }

    return res.status(200).json({ success: true, posts, nextCursor });
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  const { content, imageUrls = [] } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ error: "Post content is required" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
        images: {
          create: Array.isArray(imageUrls)
            ? imageUrls.map((url) => ({ url }))
            : [],
        },
      },
      include: {
        images: true,
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
  // const { postId } = req.body;

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
    const { limit = 10, cursor } = req.query;
    const take = parseInt(limit);
    const cursorId = cursor ? parseInt(cursor) : undefined;

    const posts = await prisma.post.findMany({
      take: take + 1,
      ...(cursorId && {
        skip: 1,
        cursor: {
          id: cursorId,
        },
      }),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        images: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    let nextCursor = null;
    if (posts.length > take) {
      const nextItem = posts.pop();
      nextCursor = nextItem.id;
    }

    res.status(200).json({ success: true, posts, nextCursor });
  } catch (error) {
    console.error("Error fetching posts:", error);
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
            email: true,
            profilePicUrl: true,
          },
        },
        images: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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
