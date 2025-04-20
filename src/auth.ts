import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { User } from "./graphql/TypesDefs/index.js";
import { FastifyReply } from "fastify";

const SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateToken = (user: User) => {
  return jwt.sign({ user: user }, SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ user }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { user: User };
  } catch (error) {
    throw new Error("Token inválido");
  }
};
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { user: User };
  } catch (error) {
    throw new Error("Token inválido");
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export async function tryRefreshToken(
  refreshToken: string,
  reply: FastifyReply
): Promise<User | null> {
  try {
    const { user } = verifyRefreshToken(refreshToken);
    const newToken = generateToken(user);

    reply.setCookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    return user;
  } catch {
    reply.clearCookie("token");
    reply.clearCookie("refreshToken");
    return null;
  }
}
