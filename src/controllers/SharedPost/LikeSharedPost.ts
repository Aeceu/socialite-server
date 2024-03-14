import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getSharedPostLikes = async (req: Request, res: Response) => {
  try {
    const sharedPostId = req.params.sharedPostId;
    const sharedPostLikes = await prisma.sharedPost.findFirst({
      where: {
        id: sharedPostId,
      },
      select: {
        likes: true,
      },
    });
    res.status(200).json(sharedPostLikes);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

export const likesSharedPost = async (req: Request, res: Response) => {
  try {
    const sharedPostId = req.params.sharedPostId;
    const userId = req.params.userId;

    const sharedPostLikes = await prisma.sharedPost.update({
      where: {
        id: sharedPostId,
      },
      include: { likes: true },
      data: {
        likes: {
          create: {
            likersId: userId,
          },
        },
      },
    });

    res.status(200).json(sharedPostLikes);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

export const unlikeSharedPost = async (req: Request, res: Response) => {
  try {
    const likeId = req.params.likeId;
    const sharedPostId = req.params.sharedPostId;

    await prisma.likes.delete({
      where: {
        id: likeId,
      },
    });

    const sharedPostUnlikes = await prisma.sharedPost.findFirst({
      where: {
        id: sharedPostId,
      },
      select: {
        likes: true,
      },
    });
    res.status(200).json(sharedPostUnlikes);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
