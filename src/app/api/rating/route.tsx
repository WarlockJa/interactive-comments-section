import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/globalPrisma";
import { IUserRatings } from "../../utils/initDB";

export interface IChangeRatingBody {
    id: string;
    postId: string;
    rating: number;
}

export const getNewRatingsArray = (
    body: IChangeRatingBody,
    userRatings: IUserRatings[]
) => {
    const validRating = body.rating > 0 ? 1 : body.rating < 0 ? -1 : 0;
    const result =
        // new rating is 0, removing post id from the array
        validRating === 0
            ? // checking if userRatings exists
              userRatings
                ? // array exists removing item
                  userRatings.filter((item) => item.id !== body.postId)
                : // no array found, creating empty array
                  []
            : userRatings
            ? // new rating is not 0
              userRatings.findIndex((item) => item.id === body.postId) !== -1
                ? // item found in the array updating rating
                  userRatings.map((item) =>
                      item.id === body.postId
                          ? { id: item.id, rating: validRating }
                          : item
                  )
                : // item not found in the array, adding item
                  [...userRatings, { id: body.postId, rating: validRating }]
            : // no array found, creating array with the item
              [{ id: body.postId, rating: validRating }];

    return result;
};

export async function PUT(req: NextRequest, res: NextResponse) {
    const body: IChangeRatingBody = await req.json();

    try {
        // looking for a thread with given id
        // in this example project there is only one thread
        const data = await prisma.interactive_comment_section.findFirst({
            where: {
                id: body.id,
            },
            select: {
                currentUser: true,
            },
        });

        // response if no thread found
        if (!data)
            return new Response(`Thread with id: ${body.id} not found`, {
                status: 400,
            });

        // preparing new ratings array to be stored in DB
        const newCurrentRatingsArray: IUserRatings[] = getNewRatingsArray(
            body,
            data.currentUser.userRatings
        );

        // updating DB with new ratings array
        await prisma.interactive_comment_section.update({
            where: {
                id: body.id,
            },
            data: {
                currentUser: {
                    update: {
                        // @ts-ignore // inexplicable prisma ts error
                        userRatings: newCurrentRatingsArray,
                    },
                },
            },
        });

        return new Response("User rating list updated", {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
