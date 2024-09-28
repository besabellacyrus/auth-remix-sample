import { prisma } from "./prisma.server";
import jwt from "jsonwebtoken";
import { redirect } from "@remix-run/node";

type JwtPayload = {
  userId: string;
};

export const requireUser = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const token = cookie?.split("token=")?.[1];

  if (!token) {
    throw redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw redirect("/login");

    return user;
  } catch (error) {
    throw redirect("/login");
  }
};