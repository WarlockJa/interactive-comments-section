import initData from "../../../data.json";
import { prisma } from "../../../db/globalPrisma";
import { subDays, subMonths, subWeeks } from "date-fns";

export interface IUserRatings {
    id: String;
    rating: number;
}

export interface IUserData {
    id: string;
    image: {
        png: string;
        webp: string;
    };
    username: string;
    userRatings: IUserRatings[];
}

export interface ICommentData {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    score: number;
    authorId: string;
    repliesToPostId: string | null;
    replies?: ICommentData[];
}

const initDB = async () => {
    let currentUser: IUserData | null = null;
    let comments: ICommentData[] | null = null;
    // fetching current refreshTimestamp from the DB
    try {
        // client DB mutation grace period
        const refreshTimestamp = await prisma.reset.findFirst();
        // comparing current time with saved timestamp in the database
        // if ten minutes (10 * 60 * 1000) has passed reinitialize the DB
        // otherwise use the data currently present in the DB allowing client
        // to access mutated data and/or refresh the page
        if (
            !refreshTimestamp?.resetTimer ||
            new Date(refreshTimestamp.resetTimer).getTime() <
                new Date().getTime() - 10 * 60 * 1000
        ) {
            // DB reinitialization
            // deleting post collection with a raw mongodb command due to existing self-relations
            // and prisma not supporting onDelete: Cascade for MongoDB
            await prisma.$runCommandRaw({
                drop: "post",
            });
            await prisma.$transaction([
                prisma.user.deleteMany(),
                prisma.reset.deleteMany(),
            ]);

            // seeding initial data
            await prisma.$transaction([
                prisma.reset.create({
                    data: {},
                }),
                prisma.user.create({
                    data: {
                        username: initData.comments[0].user.username,
                        image: initData.comments[0].user.image,
                        userRatings: [],
                        post: {
                            create: {
                                content: initData.comments[0].content,
                                score: initData.comments[0].score,
                                createdAt: subMonths(new Date(), 1),
                            },
                        },
                    },
                }),
                prisma.user.create({
                    data: {
                        username: initData.comments[1].user.username,
                        image: initData.comments[1].user.image,
                        userRatings: [],
                        post: {
                            create: {
                                content: initData.comments[1].content,
                                score: initData.comments[1].score,
                                createdAt: subWeeks(new Date(), 2),
                            },
                        },
                    },
                }),
            ]);

            // finding id of the post that will have replies realtions
            const secondPostId = await prisma.post.findFirst({
                where: {
                    author: {
                        username: initData.comments[1].user.username,
                    },
                },
                select: {
                    id: true,
                },
            });

            await prisma.$transaction([
                prisma.user.create({
                    data: {
                        username: initData.comments[1].replies[0].user.username,
                        image: initData.comments[1].replies[0].user.image,
                        userRatings: [],
                        post: {
                            create: {
                                content:
                                    initData.comments[1].replies[0].content,
                                score: initData.comments[1].replies[0].score,
                                createdAt: subWeeks(new Date(), 1),
                                repliesToPost: {
                                    connect: {
                                        id: secondPostId?.id,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.user.create({
                    data: {
                        username: initData.comments[1].replies[1].user.username,
                        image: initData.comments[1].replies[1].user.image,
                        userRatings: [],
                        post: {
                            create: {
                                content:
                                    initData.comments[1].replies[1].content,
                                score: initData.comments[1].replies[1].score,
                                createdAt: subDays(new Date(), 2),
                                repliesToPost: {
                                    connect: {
                                        id: secondPostId?.id,
                                    },
                                },
                            },
                        },
                    },
                }),
            ]);

            console.log("InitDB Finished");
        }

        // fetching current data from the DB
        currentUser = await prisma.user.findUnique({
            where: {
                username: initData.comments[1].replies[1].user.username,
            },
        });

        comments = await prisma.post.findMany();
    } catch (error) {
        console.log(error);
    }

    return { currentUser, comments };
};

export { initDB };
