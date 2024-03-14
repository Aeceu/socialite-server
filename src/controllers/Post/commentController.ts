import { Response, Request } from "express";
import prisma from "../../utils/prisma";

// TODO: GET post comments
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const postComments = await prisma.post.findFirst({
      where: {
        id: postId,
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
    res.status(200).json(postComments?.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// TODO: CREATE comment on post
export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { comment } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        comment,
        postId,
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
    res.status(500).json(error);
  }
};

// TODO: DELETE the comment on post (only the post creator can delete the comment of anyone)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const deleteComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(200).json(deleteComment);
  } catch (error) {
    console.log();
    res.status(500).json(error);
  }
};

// TODO: UPDATE the comment on post
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const comment = req.body;

    await prisma.comment.update({
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
    res.status(200).json("Comment updated successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
