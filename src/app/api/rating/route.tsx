import { NextRequest } from "next/server";
import { prisma } from "../../../../db/globalPrisma";
import { IUserRatings } from "../../utils/initDB";

export interface IChangeRatingBody {
    userId: string;
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

export async function PUT(req: NextRequest) {
    const body: IChangeRatingBody = await req.json();

    if (!body.postId)
        return new Response("Comment ID required", { status: 400 });

    try {
        // looking for a user with given id
        // altough in this example project there is only one possible user
        const data = await prisma.user.findFirst({
            where: {
                id: body.userId,
            },
            select: {
                userRatings: true,
            },
        });

        // response if no user found
        if (!data)
            return new Response(`User with id: ${body.userId} not found`, {
                status: 400,
            });

        // preparing new ratings array to be stored in DB
        const newCurrentRatingsArray: IUserRatings[] = getNewRatingsArray(
            body,
            data.userRatings
        );

        // updating DB with new ratings array
        await prisma.user.update({
            where: {
                id: body.userId,
            },
            data: {
                userRatings: {
                    // @ts-ignore // inexplicable prisma ts error
                    set: newCurrentRatingsArray,
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
