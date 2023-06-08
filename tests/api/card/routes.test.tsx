import { IChangeRatingBody } from "@/app/api/comment/route";
import { getNewRatingsArray } from "@/app/api/ratings/route";
import { IUserRatings } from "@/app/utils/initDB";

test("Add item to the empty array", () => {
    const userRatings: IUserRatings[] = [];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: 1,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post_uuidv4",
            rating: 1,
        },
    ]);
});

test("Add item to the non-empty array", () => {
    const userRatings: IUserRatings[] = [
        {
            id: "post0_uuidv4",
            rating: 1,
        },
    ];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post1_uuidv4",
        rating: 1,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post0_uuidv4",
            rating: 1,
        },
        {
            id: "post1_uuidv4",
            rating: 1,
        },
    ]);
});

test("Update item in the array", () => {
    const userRatings: IUserRatings[] = [
        {
            id: "post_uuidv4",
            rating: 1,
        },
    ];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: -1,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post_uuidv4",
            rating: -1,
        },
    ]);
});

test("Remove item in the array by passing rating 0", () => {
    const userRatings: IUserRatings[] = [
        {
            id: "post_uuidv4",
            rating: 1,
        },
    ];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: 0,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([]);
});

test("Pass rating 0 item into an empty array", () => {
    const userRatings: IUserRatings[] = [];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: 0,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([]);
});

test("Pass improper rating 12 item", () => {
    const userRatings: IUserRatings[] = [];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: 12,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post_uuidv4",
            rating: 1,
        },
    ]);
});

test("Pass improper rating -12 item", () => {
    const userRatings: IUserRatings[] = [];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: -12,
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post_uuidv4",
            rating: -1,
        },
    ]);
});

test("Pass improper rating 'aaaa' item", () => {
    const userRatings: IUserRatings[] = [];
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        // @ts-expect-error
        rating: "aaa",
    };
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([]);
});

test("Pass an undefined array", () => {
    // @ts-expect-error
    const userRatings: undefined;
    const body: IChangeRatingBody = {
        id: "thread_uuidv4",
        postId: "post_uuidv4",
        rating: 1,
    };
    // @ts-expect-error
    expect(getNewRatingsArray(body, userRatings)).toStrictEqual([
        {
            id: "post_uuidv4",
            rating: 1,
        },
    ]);
});
