import "reflect-metadata";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import mercurius from "mercurius";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/Resolvers";
import fastifyCookie from "@fastify/cookie";
import "dotenv/config";
import { verifyToken } from "./auth";
import { GraphQLContext } from "./types";

const app = Fastify();

async function start() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  app.register(fastifyCors, {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.register(fastifyCookie, {
    secret: process.env.JWT_SECRET,
    parseOptions: {},
  });

  app.register(mercurius, {
    schema,
    graphiql: true,
    context: async (request, reply): Promise<GraphQLContext> => {
      const token = request.cookies.token;

      if (!token) {
        return { request, reply, user: null };
      }

      try {
        const { user } = verifyToken(token);
        return { request, reply, user: user };
      } catch (error) {
        reply.clearCookie('token')
        return { request, reply, user: null };
      }
    },
  });

  app.listen({ port: 4000 }, () => {
    console.log("🚀 Servidor rodando em http://localhost:4000/graphiql");
  });
}

start();
