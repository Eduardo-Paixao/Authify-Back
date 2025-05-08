import "reflect-metadata";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import mercurius from "mercurius";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/Resolvers/index.js";
import fastifyCookie from "@fastify/cookie";
import "dotenv/config";
import { tryRefreshToken, verifyToken } from "./auth.js";
import { GraphQLContext } from "./types/index.js";

const app = Fastify();

async function start() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  app.register(fastifyCors, {
    origin: ["http://localhost:3000","https://authify-front.vercel.app/"],
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
      const refreshToken = request.cookies.refreshToken;

      if (!token) {
        return { request, reply, user: null };
      }

      try {
        const { user } = verifyToken(token);
        return { request, reply, user: user };
      } catch (error) {
        if (!refreshToken) {
          return { request, reply, user: null };
        }
        const user = await tryRefreshToken(refreshToken, reply);
        return { request, reply, user };
      }
    },
  });

  const PORT = Number(process.env.PORT) || 4000;

  app.listen({ port: PORT, host: "0.0.0.0" }, () => {

    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphiql`);
    
  });
}

start();
