import { Response, Request } from "express";
import prisma from "../../utils/prisma";
import exclude from "../../utils/exclude";

// TODO: Get all the user's friend
export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const friends = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        friends: {
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

    res.status(200).json(friends?.friends);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO: Add new friend
export const addFriend = async (req: Request, res: Response) => {
  try {
    const friendId = req.params.friendId; // ? Id of the user you want to add
    const userId = req.params.userId; // ? Id of the user that wants to add new friend (you)

    //? Finds the user
    const friend = await prisma.user.findFirst({
      where: { id: friendId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        profile_img: true,
        email: true,
      },
    });

    if (!friend) {
      return res.status(400).json("Friend does not exists!");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      include: {
        profile_img: true,
        friends: true,
      },
      data: {
        friends: {
          connect: friend,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: friendId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        profile_img: true,
        email: true,
      },
      data: {
        friends: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json(friend);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO: Unfriend
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          },
        },
      },
    });

    const friend = await prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          disconnect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        profile_img: true,
        email: true,
      },
    });
    res.status(200).json(friend);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// TODO: Get all the user's not friend
export const getUserNotFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const Users = await prisma.user.findMany({
      where: {
        AND: [
          {
            friends: {
              none: {
                id: userId,
              },
            },
          },
          {
            id: {
              not: userId,
            },
          },
        ],
      },
      include: {
        profile_img: true,
      },
    });

    const usersWithoutPass = Users.map((user) =>
      exclude(user, ["password", "refreshToken"])
    );

    res.status(200).json(usersWithoutPass);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

//TODO: Get the searched user
export const getSearch = async (req: Request, res: Response) => {
  try {
    const search = req.params.search;
    const result = search.split(" ");
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            first_name: search,
          },
          {
            last_name: search,
          },
          {
            first_name: result[0],
          },
          {
            last_name: result[1],
          },
          {
            email: search,
          },
        ],
      },
      include: {
        profile_img: true,
      },
    });
    const usersWithoutPass = users.map((user) =>
      exclude(user, ["password", "refreshToken"])
    );
    res.status(200).json(usersWithoutPass);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
