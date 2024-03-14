import { Request, Response } from "express";
import prisma from "../../utils/prisma";

// TODO: GET sharedpost comments
export const getSharedPostComments = async (req: Request, res: Response) => {
  try {
    const sharedPostId = req.params.sharedPostId;
    const sharedPostComments = await prisma.sharedPost.findFirst({
      where: {
        id: sharedPostId,
      },
      select: {
        comments: {
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
    });
    res.status(200).json(sharedPostComments?.comments);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO: CREATE comment on  sharedpost
export const createSharedPostComment = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const sharedPostId = req.params.sharedPostId;
    const { comment } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        comment,
        sharedPostId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO: DELETE the comment on the sharedpost (only the creator of sharedpoost can delete comment)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(200).json(deleteComment);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO UPDATE the comment on post
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { comment } = req.body;

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
