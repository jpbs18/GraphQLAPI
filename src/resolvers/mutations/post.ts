import { Post, Prisma } from "@prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post?: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "You must be authenticated" }],
        post: null,
      };
    }

    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and a content to create a Post",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: await prisma.post.create({
        data: {
          title,
          content,
          userId: userInfo.userId,
        },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "You must be authenticated" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          { message: "You must provide at least one field to update a post" },
        ],
        post: null,
      };
    }

    const postToUpdate = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!postToUpdate) {
      return {
        userErrors: [{ message: "We could not find a post with that ID" }],
        post: null,
      };
    }

    let payloadToUpdate = { title, content };

    if (!title) {
      delete payloadToUpdate.title;
    }

    if (!content) {
      delete payloadToUpdate.content;
    }

    return {
      userErrors: [],
      post: await prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: +postId,
        },
      }),
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "You must be authenticated" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    const postToDelete = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!postToDelete) {
      return {
        userErrors: [{ message: "We could not find a post with that ID" }],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: +postId,
      },
    });

    return {
      userErrors: [],
      post: postToDelete,
    };
  },
  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "You must be authenticated" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: +postId
        },
        data: {
          published: true,
        },
      }),
    };
  },
  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "You must be authenticated" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: +postId
        },
        data: {
          published: false,
        }
      }),
    };
  },
};