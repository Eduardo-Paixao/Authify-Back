import { ObjectType, Field, ID, Int } from "type-graphql";

// Definir o modelo User usando TypeGraphQL
@ObjectType()
export class Role {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  name!: string;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => [Role])
  roles!: Role[];
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;
  @Field(() => User)
  user!: User
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users!: User[];

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Boolean)
  hasMore!: boolean;
}