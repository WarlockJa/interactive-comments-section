import { NextRequest } from "next/server";
import { prisma } from "../../../../db/globalPrisma";

interface IPostUserRequestBody {
    id: string;
}

export async function POST(req: NextRequest) {
    const body: IPostUserRequestBody = await req.json();
    if (!body.id) return new Response("User id required", { status: 400 });

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: body.id,
            },
        });
        return user
            ? new Response(JSON.stringify(user), {
                  status: 200,
              })
            : new Response("user not found", {
                  status: 404,
              });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
