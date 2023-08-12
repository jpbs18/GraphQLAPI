import { Context } from "..";

interface UserParentType {
  id: number;
}

export const User = {
  posts: (parent: UserParentType, __: any, { prisma, userInfo }: Context) => {
    const isOwnProfile = parent.id === userInfo?.userId

    if(isOwnProfile){
        return prisma.post.findMany({
            where:{
                userId: parent.id
            },
            orderBy: [
                { 
                    createdAt: "desc" 
                }
            ]
        })
    }

    return prisma.post.findMany({
      where: {
        userId: parent.id,
        published: true
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
