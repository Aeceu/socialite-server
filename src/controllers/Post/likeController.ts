import { Response, Request } from "express";
import prisma from "../../utils/prisma";

// TODO: GET the likes of the post by postId
export const getLikes = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const postLikes = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        likes: true,
      },
    });
    res.status(200).json(postLikes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: UPDATE the post to like it
export const likePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId; // id of the likers

    const postLikes = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          create: {
            likersId: userId,
          },
        },
      },
      select: {
        likes: true,
      },
    });
    res.status(200).json(postLikes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: UPDATE the post to unlike it
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const likeId = req.params.likeId;
    const postId = req.params.postId;

    await prisma.likes.delete({
      where: {
        id: likeId,
      },
    });

    const postUnlikes = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        likes: true,
      },
    });

    res.status(200).json(postUnlikes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
