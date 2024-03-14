import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import exclude from "../utils/exclude";

const prisma = new PrismaClient();

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.auth) return res.sendStatus(401);

  const refreshToken = cookies.auth;
  const foundUser = await prisma.user.findFirst({
    where: {
      refreshToken,
    },
    include: {
      post: true,
      profile_img: true,
    },
  });

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET!,
    (err: any, decoded: any) => {
      if (err || foundUser?.email !== decoded.email) {
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign(
        {
          user_data: {
            id: foundUser.id,
            email: foundUser.email,
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
          },
        },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "10s",
        }
      );
      const user = exclude(foundUser, ["password", "refreshToken"]);
      res.json({ user, accessToken });
    }
  );
};
