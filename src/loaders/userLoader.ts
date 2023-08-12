import DataLoader from "dataloader";
import { prisma } from "../index";
import { User } from ".prisma/client";


const batchUsers = async (ids: number[]) => {
    const users = await prisma.user.findMany({
        where:{
            id: {
                in: ids
            }
        }
    });

    const userMap: { [key: string]: User } = {};
    users.forEach(user => userMap[user.id] = user);
    return ids.map(id => userMap[id]);
}

//@ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);