import { NextRequest } from "next/server";
import { prisma } from "../../../../db/globalPrisma";

// this route is unused as it is replaced with a server action
// located at @/app/lib/actions

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
        const result = await prisma.post.create({
            data: {
                content: body.content,
                authorId: body.authorId,
                repliesToPostId: body.repliesToPostId,
            },
        });

        return new Response(JSON.stringify(result), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
