import { Response, Request } from "express";
import prisma from "../utils/prisma";
import exclude from "../utils/exclude";
import cloudinary from "../utils/cloudinary";
import e from "cors";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile_img: true,
      },
    });
    const usersWithoutPass = users.map((user) =>
      exclude(user, ["password", "refreshToken"])
    );
    res.status(200).json({ users: usersWithoutPass });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        profile_img: true,
      },
    });

    if (user) {
      const usersWithoutPass = exclude(user, ["password", "refreshToken"]);
      res.status(200).json(usersWithoutPass);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { data, file } = req.body;

    const user = await prisma.user.update({
      where: {
        id,
      },
      include: {
        profile_img: true,
      },
      data: { ...data },
    });

    if (file) {
      // TODO: Delete the image in cloudinary database
      if (user.profile_img?.profile_image_id) {
        await cloudinary.uploader.destroy(user.profile_img.profile_image_id);
      }
      // TODO: Upload new image and update the user's profile
      const result = await cloudinary.uploader.upload(file, {
        folder: "SociaLite_Profile",
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          profile_img: {
            update: {
              profile_image_id: result.public_id,
              profile_secure_url: result.secure_url,
            },
          },
        },
      });
    }

    res.status(200).json("User updated successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.delete({
      where: {
        id,
      },
      include: {
        post: true,
        profile_img: true,
      },
    });

    //TODO: if there's an image attach to the user's database, delete it also on cloudinary
    if (
      user.profile_img?.profile_image_id ||
      user.profile_img?.profile_secure_url
    ) {
      await cloudinary.uploader.destroy(user.profile_img.profile_image_id);
    }

    res.status(200).json("User deleted successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUserProfileImage = async (req: Request, res: Response) => {
  try {
    const { file } = req.body;
    const userId = req.params.userId;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile_img: true,
      },
    });
    if (!user) {
      return res.status(400).json("User does not exists!");
    }
    if (
      user.profile_img?.profile_secure_url ||
      user.profile_img?.profile_image_id
    ) {
      await cloudinary.uploader.destroy(user.profile_img?.profile_image_id);
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "SociaLie_Profile_Image",
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      include: {
        profile_img: true,
      },
      data: {
        profile_img: {
          update: {
            profile_image_id: result.public_id,
            profile_secure_url: result.secure_url,
          },
        },
      },
    });
    const usersWithoutPass = exclude(updatedUser, ["password", "refreshToken"]);

    res.status(200).json(usersWithoutPass);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUserCoverPhoto = async (req: Request, res: Response) => {
  try {
    const { file } = req.body;
    const userId = req.params.userId;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile_img: true,
      },
    });
    if (!user) {
      return res.status(400).json("User does not exists!");
    }
    if (
      user.profile_img?.cover_secure_url ||
      user.profile_img?.cover_image_id
    ) {
      await cloudinary.uploader.destroy(user.profile_img?.cover_image_id);
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "SociaLite_Cover_Image",
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      include: {
        profile_img: true,
      },
      data: {
        profile_img: {
          update: {
            cover_image_id: result.public_id,
            cover_secure_url: result.secure_url,
          },
        },
      },
    });
    const usersWithoutPass = exclude(updatedUser, ["password", "refreshToken"]);

    res.status(200).json(usersWithoutPass);
  } catch (error) {
    console.log(error);
    res.status(500).json(e);
  }
};

export const getUserFriendsById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const users = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        friends: {
          include: {
            profile_img: true,
          },
        },
      },
    });

    const usersFriends = users?.friends.map((item) =>
      exclude(item, ["password", "refreshToken"])
    );
    res.status(200).json(usersFriends);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
