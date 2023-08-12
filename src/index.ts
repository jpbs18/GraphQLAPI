import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Mutation, Profile, Post, User } from "./resolvers";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userInfo: {
    userId: number
  } | null
} 

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile, 
    Post, 
    User
  },
  context: async({ req }: any): Promise<Context> => {
    const jsonWebToken = req.headers.authorization;
    const userInfo = getUserFromToken(jsonWebToken);

    return {
      prisma,
      userInfo
    }
  },
});


server.listen().then(({ url }) => console.log(`Server running on ${url}`));