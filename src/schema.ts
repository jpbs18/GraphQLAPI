import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    profile(userId: ID!): Profile
    posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
    signup(name: String!, credentials: CredentialsInput!, bio: String!): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
  }

  input CredentialsInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String
    content: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    isMyProfile: Boolean!
    bio: String!
    user: User!
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type UserError {
    message: String!
  }
`;
