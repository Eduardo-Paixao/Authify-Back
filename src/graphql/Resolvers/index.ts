import { Query, Mutation, Arg, Resolver, Ctx, Int } from "type-graphql";
import {
  hashPassword,
  generateToken,
  comparePassword,
  generateRefreshToken,
} from "../../auth.js";
import { User, AuthPayload, PaginatedUsers } from "../TypesDefs/index.js";
import { PrismaClient } from "@prisma/client";
import { FastifyReply } from "fastify";
import "dotenv/config";
import { GraphQLContext } from "../../types/index.js";

const prisma = new PrismaClient();

@Resolver()
export class UserResolver {
  @Query(() => PaginatedUsers)
  async paginatedUsers(
    @Ctx() ctx: GraphQLContext,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number = 1,
    @Arg("limit", () => Int, { defaultValue: 3 }) limit: number = 3
  ) {
    if (!ctx.user) {
      throw new Error("Não autorizado");
    }
    const skip = (page - 1) * limit;
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: skip,
        take: limit,
        include: { roles: true },
      }),
      prisma.user.count(),
    ]);
    const hasMore = skip + users.length < totalCount;

    return { users, totalCount, hasMore };
  }

  @Mutation(() => User)
  async register(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("roles", () => String) roles: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<User> {
    try {
      if (!ctx.user) {
        throw new Error("Não autorizado");
      }
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("E-mail já está em uso.");
      }
      const role = await prisma.role.upsert({
        where: { name: roles },
        update: {},
        create: { name: roles },
      });
      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roles: { connect: { id: role.id } },
        },
        include: {
          roles: true,
        },
      });
      return { ...user };
    } catch (error) {
      console.error("erro ao registrar usuario", error);
      throw new Error("erro ao registar usuario");
    }
  }
  @Mutation(() => User)
  async update(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Arg("roles", () => String) roles: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<User> {
    try {
      if (!ctx.user) {
        throw new Error("Não autorizado");
      }
      if (!name || name.trim() === "") {
        throw new Error("O nome é obrigatório.");
      }
      if (!roles || roles.length === 0) {
        throw new Error("O usuário deve ter pelo menos uma role.");
      }
      const role = await prisma.role.upsert({
        where: { name: roles },
        update: {},
        create: { name: roles },
      });
      const user = await prisma.user.update({
        where: { email },
        data: {
          name,
          roles: { set: [{ id: role.id }] },
        },
        include: {
          roles: true,
        },
      });
      return { ...user };
    } catch (error) {
      console.error("erro ao editar usuario", error);
      throw new Error("erro ao editar usuario");
    }
  }

  @Mutation(() => AuthPayload)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: { reply: FastifyReply }
  ): Promise<AuthPayload | ErrorConstructor> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { roles: true },
      });

      const valid = await comparePassword(password, user?.password || "");
      if (!valid || !user) throw new Error("Credenciais invalidas");
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      ctx.reply.setCookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });
      ctx.reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return { token, user };
    } catch (error) {
      throw new Error("Credenciais invalidas");
    }
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: { reply: FastifyReply }) {
    try {
      ctx.reply.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });
      ctx.reply.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return true;
    } catch (error) {
      throw new Error("Credenciais invalidas");
    }
  }
}
