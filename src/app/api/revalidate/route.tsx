import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

// this route is not used
// the idea was to use NextJS cache fetch with tags in order to control the amount
// of DB requests. However not even get requests behaved the expected from the docs way.

// tag revalidation
export async function GET(req: NextRequest) {
    const tag = req.nextUrl.searchParams.get("tag");

    if (tag) {
        revalidateTag(tag);
    } else {
        return new Response("Tag required", { status: 400 });
    }

    return new Response(`Tag ${tag} revalidated`, { status: 200 });
}
