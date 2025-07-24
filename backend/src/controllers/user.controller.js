import prisma from "../prismaClient.js";

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true,
      },
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// profile
export const getUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profilePicUrl: true,
        email: true,
        bio: true,
        createdAt: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
        },

        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
        },

        posts: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            images: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      bio: user.bio,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      createdAt: user.createdAt,

      posts: user.posts,

      followers: user.followers.map((f) => f.follower),
      following: user.following.map((f) => f.following),
    };

    res.status(200).json({ success: true, user: formattedUser });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  const userId = req.user.userId; // userId was stored in req.user by the authenticate middleware (token verification)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true,
        bio: true,
        createdAt: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
                profilePicUrl: true,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            imageUrl: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user data:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.userId;
  const { username, email, bio, profilePicUrl } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (bio) updateData.bio = bio;
  if (profilePicUrl) updateData.profilePicUrl = profilePicUrl;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFollowers = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }, // only fetch the id
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const followers = await prisma.userRelation.findMany({
      where: { followingId: userId },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ success: true, followers: followers.map((f) => f.follower) });
  } catch (error) {
    console.log("Error fetching user followers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFollowing = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }, // only fetch the id
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = await prisma.userRelation.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ success: true, following: following.map((f) => f.following) });
  } catch (error) {
    console.log("Error fetching user following:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// user posts
// This function retrieves posts made by a specific user based on their user ID.

export const followUser = async (req, res) => {
  const followerId = req.user.userId; // userId from the authenticated user
  const followingId = parseInt(req.params.id, 10); // ID of the user to follow

  if (followerId === followingId) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }

  if (!followingId) {
    return res.status(400).json({ error: "User ID to follow is required" });
  }

  try {
    const alreadyFollowing = await prisma.userRelation.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (alreadyFollowing) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }
    // Follow

    await prisma.userRelation.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json({ success: true, message: "User followed" });
  } catch (error) {
    console.log("Error following user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unfollowUser = async (req, res) => {
  const followerId = req.user.userId; // userId from the authenticated user
  const followingId = parseInt(req.params.id, 10); // ID of the user
  if (followerId === followingId) {
    return res.status(400).json({ error: "You can't unfollow yourself" });
  }

  if (!followingId) {
    return res.status(400).json({ error: "User ID to unfollow is required" });
  }

  try {
    const existingFollow = await prisma.userRelation.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await prisma.userRelation.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "User Unfollowed" });
    } else {
      return res.status(400).json({ error: "You are not following this user" });
    }
  } catch (error) {
    console.log("Error unfollowing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
