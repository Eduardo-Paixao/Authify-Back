import { FastifyReply, FastifyRequest } from "fastify";

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  roles: { id: number; name: string }[];
}

export interface GraphQLContext {
  request: FastifyRequest;
  reply: FastifyReply;
  user: UserPayload | null;
}
