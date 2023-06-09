import { NextRequest } from "next/server";
import { prisma } from "../../../../db/globalPrisma";

interface IPostReplyRequestBody {
    id: string;
}

// getting replies
export async function POST(req: NextRequest) {
    const body: IPostReplyRequestBody = await req.json();
    if (!body) return new Response("Comment ID required", { status: 400 });

    try {
        const data = await prisma.post.findMany({
            where: {
                repliesToPostId: body.id,
            },
        });

        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
}

interface IPutReplyRequestBody {
    id: string;
}

// getting replies count
export async function PUT(req: NextRequest) {
    const body: IPutReplyRequestBody = await req.json();
    if (!body.id) return new Response("Comment id required", { status: 400 });

    try {
        const replyCount = await prisma.post.count({
            where: {
                repliesToPostId: body.id,
            },
        });
        return !isNaN(replyCount)
            ? new Response(replyCount.toString(), {
                  status: 200,
              })
            : new Response("Comment not found", {
                  status: 404,
              });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
