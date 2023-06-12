import { NextRequest } from "next/server";
import { prisma } from "../../../../db/globalPrisma";

// get user data
export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return new Response("User id required", { status: 400 });

    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
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
