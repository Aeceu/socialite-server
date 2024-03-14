import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import exclude from "../utils/exclude";

export const signup = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      return res.status(400).json("User already exists!");
    }

    const hashPass = await bcrypt.hash(data.password, 12);

    await prisma.user.create({
      data: {
        ...data,
        password: hashPass,
        profile_img: {
          create: {
            profile_image_id: "",
            profile_secure_url: "",
            cover_image_id: "",
            cover_secure_url: "",
          },
        },
      },
    });

    res.status(200).json("User successfully created!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const userExists = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      include: {
        post: true,
        profile_img: true,
      },
    });

    if (!userExists) {
      return res.status(400).json("User does not exists!");
    }

    const validPass = await bcrypt.compare(data.password, userExists.password);

    if (!validPass) {
      return res.status(400).json("Password doesn't match");
    }

    const user_data = {
      id: userExists.id,
      email: userExists.email,
      first_name: userExists.first_name,
      last_name: userExists.last_name,
    };

    const accessToken = jwt.sign(user_data, process.env.TOKEN_SECRET!, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(user_data, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    await prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        refreshToken,
      },
    });

    res.cookie("auth", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = exclude(userExists, ["password", "refreshToken"]);

    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.auth) return res.sendStatus(204); //No content
  const refreshToken = cookies.auth;

  //* Is refreshToken in db?
  const foundUser = await prisma.user.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!foundUser) {
    res.clearCookie("auth", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  //* Delete refreshToken in db
  await prisma.user.update({
    where: {
      id: foundUser.id,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("auth", { httpOnly: true, sameSite: "none", secure: true });
  res.status(200).send("Log out successfully!");
};
