"use server";
// server actions library

import { prisma } from "../../db/globalPrisma";

// post new comment to the DB
export const postAddAction = async ({
    authorId,
    repliesToPostId,
    content,
}: {
    postId?: string;
    authorId: string;
    repliesToPostId: string;
    content: string;
}) => {
    const result = await prisma.post.create({
        data: {
            content,
            authorId,
            repliesToPostId,
        },
    });

    return result;
};

// update comment in the DB
export const postUpdateAction = async ({
    postId,
    content,
}: {
    postId: string;
    content: string;
}) => {
    const result = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            content,
        },
    });

    return result;
};

// delete comment from the DB
export const postDeleteAction = async (id: string) => {
    await prisma.post.delete({
        where: {
            id,
        },
    });
};
