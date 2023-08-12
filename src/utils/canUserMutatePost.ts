import { Context } from ".."

interface CanUserMutatePostArgs{
    userId: number
    postId: number
    prisma: Context["prisma"]
}

export const canUserMutatePost = async({ userId, postId, prisma }: CanUserMutatePostArgs) => {
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    })

    const post = await prisma.post.findUnique({
        where:{
            id: postId
        }
    })

    if(post?.userId !== user?.id){
        return {
            userErrors: [{ message: "This post does not belong to the user" }], 
            post: null
        }
    }
}