import { v4 as uuidv4 } from "uuid";
import initData from "../../../data.json";
import { prisma } from "../../../db/globalPrisma";
import { subDays, subMonths } from "date-fns";

interface IFetchedDBData {
    id: string;
    comments: ICommentData[];
    currentUser: ICurrentUser;
}

export interface IUserRatings {
    id: String;
    rating: number;
}

export interface ICurrentUser extends IUserData {
    userRatings: IUserRatings[];
}

export interface IUserData {
    image: {
        png: string;
        webp: string;
    };
    username: string;
}

export interface IReply {
    id: string;
    content: string;
    createdAt: Date;
    score: number;
    user: IUserData;
}

export interface ICommentData extends IReply {
    replies?: IReply[];
}

const initDB = async () => {
    let content: IFetchedDBData | null = null;
    // fetching current refreshTimestamp from the DB
    try {
        const refreshTimestamp =
            await prisma.interactive_comment_section.findFirst({
                select: {
                    refreshTimestamp: true,
                },
            });
        // client DB mutation grace period
        // comparing current time with saved timestamp in the database
        // if ten minutes (10 * 60 * 1000) has passed reinitialize the DB
        // otherwise use the data currently present in the DB allowing client
        // to access mutated data and/or refresh the page
        if (
            !refreshTimestamp?.refreshTimestamp ||
            new Date(refreshTimestamp.refreshTimestamp).getTime() <
                new Date().getTime() - 10 * 60 * 1000
        ) {
            // DB reinitialization
            await prisma.interactive_comment_section.deleteMany();
            // forming static content from the given json file
            const initContent = {
                currentUser: {
                    ...initData.currentUser,
                    userRatings: [],
                },
                comments: initData.comments.map((comment) => {
                    const { createdAt, ...rest } = comment;
                    // replacing json dates with random timestamps
                    // timestamp 1-3 months back from the current
                    const commentDate = subMonths(
                        new Date(),
                        Math.floor(Math.random() * 3) + 1
                    );
                    return {
                        ...rest,
                        id: uuidv4(),
                        createdAt: commentDate,
                        updatedAt: commentDate,
                        // reply dates are created in determined descending order to retain conversation logic
                        replies: comment.replies.map((reply, index) => {
                            const { createdAt, ...rest } = reply;
                            const replyDate = subDays(
                                new Date(),
                                comment.replies.length - index + 1
                            );
                            return {
                                ...rest,
                                id: uuidv4(),
                                createdAt: replyDate,
                                updatedAt: replyDate,
                            };
                        }),
                    };
                }),
            };
            // uploading initial state to the DB with renewed grace period
            await prisma.interactive_comment_section.create({
                data: {
                    ...initContent,
                },
            });
            console.log("InitDB Finished");
        }

        // fetching current data from the DB
        content = await prisma.interactive_comment_section.findFirst({
            select: {
                id: true,
                currentUser: true,
                comments: true,
            },
        });
    } catch (error) {
        console.log(error);
    }
    return content;
};

export { initDB };
