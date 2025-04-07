import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { User } from "./graphql/TypesDefs";

const SECRET = process.env.JWT_SECRET!;

export const generateToken = (user: User) => {
  return jwt.sign({ user: user }, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { user: User };
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
