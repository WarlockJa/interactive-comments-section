import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/globalPrisma";

export interface IHandleCommentPost {
    repliesToPostId: string; // root comment id
    authorId: string; // id of the current user
    content: string; // comment text
}

export async function POST(req: NextRequest) {
    const body: IHandleCommentPost = await req.json();

    if (!body.authorId || !body.content || !body.repliesToPostId)
        return new Response("Insufficient data", { status: 400 });

    try {
        // creating a new post with relations to the user and the root post
        await prisma.post.create({
            data: {
                content: body.content,
                authorId: body.authorId,
                repliesToPostId: body.repliesToPostId,
            },
        });

        return new Response("Post created", {
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
