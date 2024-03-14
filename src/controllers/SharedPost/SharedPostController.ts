import exclude from "../../utils/exclude";
import prisma from "../../utils/prisma";
import { Request, Response } from "express";

// TODO: GET sharedposts of the user (for the profile page)
export const getUserSharedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const usersharedposts = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        sharedPost: {
          include: {
            User: {
              select: {
                email: true,
                first_name: true,
                last_name: true,
                id: true,
                createdAt: true,
                profile_img: true,
              },
            },
            post: {
              include: {
                user: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    profile_img: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(usersharedposts?.sharedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: GET shared post by Id (for the post page)
export const getSharedPostById = async (req: Request, res: Response) => {
  try {
    const sharedpostId = req.params.sharedpostId;
    const post = await prisma.sharedPost.findFirst({
      where: {
        id: sharedpostId,
      },
      include: {
        post: {
          include: {
            post_img: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_img: true,
              },
            },
          },
        },
        User: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            id: true,
            profile_img: true,
          },
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: GET all sharedposts (for the feed page)
export const allSharedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.sharedPost.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            post_img: true,
            user: {
              select: {
                email: true,
                first_name: true,
                last_name: true,
                id: true,
                profile_img: true,
              },
            },
          },
        },
        User: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            id: true,
            createdAt: true,
            profile_img: true,
          },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: CREATE shared post
export const createSharedPost = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { title } = req.body;

    const sharedPost = await prisma.sharedPost.create({
      data: {
        title,
        userId,
        postId,
      },
      include: {
        post: {
          include: {
            post_img: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_img: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_img: true,
          },
        },
      },
    });

    res.status(200).json(sharedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: UPDATE shared post title
export const updateSharedPost = async (req: Request, res: Response) => {
  try {
    const sharedpostId = req.params.sharedpostId;
    const { title } = req.body;

    const updatedSharedPost = await prisma.sharedPost.update({
      where: {
        id: sharedpostId,
      },
      data: {
        title,
      },
      include: {
        post: {
          include: {
            post_img: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_img: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_img: true,
          },
        },
      },
    });
    res.status(200).json(updatedSharedPost);
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

// TODO: DELETE shared post
export const deleteSharedPost = async (req: Request, res: Response) => {
  try {
    const sharedPostId = req.params.sharedPostId;
    const sharedpost = await prisma.sharedPost.delete({
      where: {
        id: sharedPostId,
      },
      include: {
        post: {
          include: {
            post_img: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_img: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_img: true,
          },
        },
      },
    });

    res.status(200).json(sharedpost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
