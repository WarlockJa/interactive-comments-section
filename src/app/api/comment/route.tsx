import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/globalPrisma";
import { IUserData } from "@/app/utils/initDB";

export interface IHandleCommentPost {
    id: string;
    rootCommentId: string;
    content: string;
    user: IUserData;
}

export async function POST(req: NextRequest) {
    const body: IHandleCommentPost = await req.json();

    try {
        // looking for a thread with given id
        // in this example project there is only one thread
        const data = await prisma.interactive_comment_section.findFirst({
            where: {
                id: body.id,
            },
            include: {
                comments: true,
                // comments: {
                //     select: {
                //         replies: true,
                //     },
                // },
            },
        });

        console.log(data);

        // response if no thread found
        if (!data)
            return new Response(`Thread with id: ${body.id} not found`, {
                status: 400,
            });

        // preparing new ratings array to be stored in DB
        // const newCurrentRatingsArray: IUserRatings[] = getNewRatingsArray(
        //     body,
        //     data.currentUser.userRatings
        // );

        // updating DB with new ratings array
        // await prisma.interactive_comment_section.update({
        //     where: {
        //         id: body.id,
        //     },
        //     data: {
        //         currentUser: {
        //             update: {
        //                 // @ts-ignore // inexplicable prisma ts error
        //                 userRatings: newCurrentRatingsArray,
        //             },
        //         },
        //     },
        // });

        // return res.status(200).json({ message: "User rating list updated" });
        return new Response("User rating list updated", {
            status: 200,
        });
    } catch (error) {
        // return res.status(500).json({ message: error });
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
