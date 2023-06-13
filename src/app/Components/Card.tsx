"use client";
import Image from "next/image";
import ImgPlus from "../../../public/images/icon-plus.svg";
import ImgMinus from "../../../public/images/icon-minus.svg";
import ImgReply from "../../../public/images/icon-reply.svg";
import ImgDelete from "../../../public/images/icon-delete.svg";
import ImgEdit from "../../../public/images/icon-edit.svg";
import { formatDistance } from "date-fns";
import "./card.scss";
import fixImagePath from "../utils/fixImagePath";
import { useEffect, useState } from "react";
import { ICommentData, IUserRatings } from "../utils/initDB";
import useStore from "@/store/store";
import { IChangeRatingBody } from "../api/rating/route";
import CardUserSkeleton from "./CardUserSkeleton";
import DeletePopup from "./DeletePopup";
import { postUpdateAction } from "@/lib/actions";
import { commentTextIntoTags } from "../utils/commentTextIntoTags";

// finding if user rated this post before
const getUserCardRating = ({
    id,
    userRatings,
}: {
    id: string;
    userRatings: IUserRatings[];
}) => {
    const foundRating = Number(
        userRatings?.find((rating) => rating.id === id)?.rating
    );
    return isNaN(foundRating) ? 0 : foundRating;
};

// sending PUT request to the rating api route
const putRatingChangeRequest = async (props: IChangeRatingBody) => {
    const postRatingQuery: IChangeRatingBody = props;

    // fire and forget change likes/dislikes array for the current user in the DB
    fetch("/api/rating", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postRatingQuery),
    });
};

// main card form
const Card = ({
    cardData,
    unfoldReplies,
}: {
    cardData: ICommentData;
    unfoldReplies?: (value: boolean) => void;
}) => {
    // getting client-side store data
    const {
        id: currentUserId,
        username: currentUsername,
        userRatings,
    } = useStore((state) => state.currentUserData);
    const {
        setActivePost,
        commentText,
        setCommentText,
        activePost,
        users,
        addUser,
        updateComment,
    } = useStore();

    // error fetching data
    const [isError, setIsError] = useState(null);
    // user data from the store
    const data = users.find((user) => user.id === cardData.authorId);

    // delete modal flag
    const [isDelete, setIsDelete] = useState(false);
    // flag to disable input if submit button is pressed
    const [startFetch, setStartFetch] = useState(false);

    // fetching initial user data
    useEffect(() => {
        if (!data) {
            console.log("Fetching user ", cardData.authorId);
            fetch(`/api/user?id=${cardData.authorId}`)
                .then((result) => result.json())
                .then((json) => addUser(json))
                .catch((error) => setIsError(error));
        }
    }, []);

    // current user is the author of the post flag
    const ownersCard = data?.username === currentUsername;
    // rating tracking state
    const [ratingChange, setRatingChange] = useState<number>(
        getUserCardRating({
            id: cardData.id,
            userRatings: userRatings,
        })
    );

    // sending put ruequest to the api simultaniously changing local state as an optimistic update
    const handleRatingChange = (newRating: number) => {
        setRatingChange(newRating);
        putRatingChangeRequest({
            userId: currentUserId,
            postId: cardData.id,
            rating: newRating,
        });
    };

    // providing/changing data about activePost in the store for the AddReply component to render
    const handleEditReply = ({ id, text }: { id: string; text: string }) => {
        if (id === activePost) {
            setActivePost(undefined);
        } else {
            unfoldReplies && unfoldReplies(false);
            setCommentText(text);
            setActivePost(id);
        }
    };

    const testContent = commentTextIntoTags(cardData.content);

    let content;
    if (isError) {
        content = (
            <div>
                <h1>There was an error</h1>
                <pre className="card__error">{JSON.stringify(isError)}</pre>
            </div>
        );
    } else {
        content = (
            <>
                <form
                    style={startFetch ? { opacity: 0.5 } : {}}
                    className="card"
                >
                    <div className="card__header">
                        {!data ? (
                            <CardUserSkeleton />
                        ) : (
                            <>
                                <div className="card__header__imgWrapper">
                                    <Image
                                        className="card__header--avatar"
                                        src={fixImagePath(data.image.png)}
                                        alt="user avatar"
                                        width={64}
                                        height={64}
                                    />
                                </div>
                                <p className="card__header--username">
                                    {data.username}
                                </p>
                                {ownersCard && (
                                    <p className="card__header--ownerFlag">
                                        you
                                    </p>
                                )}
                            </>
                        )}
                        <div className="card__header--date">
                            {/* forcing non-owner cards to use createdAt rather than updatedAt for demonstration purposes
                            since DB will update updatedAt field  automatically and all comments will have same updatedAt date */}
                            {formatDistance(
                                ownersCard
                                    ? new Date(cardData.updatedAt)
                                    : new Date(cardData.createdAt),
                                new Date(),
                                {
                                    addSuffix: true,
                                }
                            )}
                        </div>
                    </div>
                    {cardData.id === activePost && ownersCard ? (
                        <div className="card__editComment">
                            <textarea
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="card__editComment--text"
                            ></textarea>
                            <button
                                formAction={async () => {
                                    setStartFetch(true);
                                    // updating existing post in the DB
                                    const result = await postUpdateAction({
                                        postId: activePost!,
                                        content: commentText,
                                    });
                                    result.authorId && setStartFetch(false);
                                    // updating post data in the store
                                    updateComment(activePost!, commentText);
                                    setActivePost(undefined);
                                }}
                                className={
                                    startFetch || commentText === ""
                                        ? "card__editComment--button disabled"
                                        : "card__editComment--button"
                                }
                                disabled={startFetch || commentText === ""}
                            >
                                UPDATE
                            </button>
                        </div>
                    ) : (
                        // <p className="card__comment">{cardData.content}</p>
                        <p className="card__comment">{testContent}</p>
                    )}
                    <div className="card__rating">
                        <div className="card__rating__wrapper">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    ratingChange === 1
                                        ? handleRatingChange(0)
                                        : handleRatingChange(1);
                                }}
                                className={
                                    ratingChange !== 1
                                        ? "card__rating--button card__rating--buttonLike"
                                        : "card__rating--button card__rating--buttonLike selected"
                                }
                            >
                                <Image
                                    className="svg"
                                    src={ImgPlus}
                                    alt="like"
                                />
                            </button>
                            <div className="card__rating--rating">
                                {cardData.score + ratingChange}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    ratingChange === -1
                                        ? handleRatingChange(0)
                                        : handleRatingChange(-1);
                                }}
                                className={
                                    ratingChange !== -1
                                        ? "card__rating--button card__rating--buttonDislike"
                                        : "card__rating--button card__rating--buttonDislike selected"
                                }
                            >
                                <Image
                                    className="svg"
                                    src={ImgMinus}
                                    alt="dislike"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="card__interact">
                        {ownersCard ? (
                            <div>
                                <button
                                    className="card__interact--button card__interact--buttonDelete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsDelete(true);
                                    }}
                                >
                                    <Image
                                        className="card__interact--deleteIcon"
                                        src={ImgDelete}
                                        alt="delete comment"
                                    />
                                    Delete
                                </button>
                                <button
                                    className="card__interact--button card__interact--buttonEdit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEditReply({
                                            id: cardData.id,
                                            text: cardData.content,
                                        });
                                        setActivePost(
                                            activePost === cardData.id
                                                ? undefined
                                                : cardData.id
                                        );
                                    }}
                                    disabled={!data}
                                >
                                    <Image
                                        className="card__interact--editIcon"
                                        src={ImgEdit}
                                        alt="edit comment"
                                    />
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <button
                                className="card__interact--button card__interact--buttonReply"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleEditReply({
                                        id: cardData.id,
                                        text: `@${data!.username} `,
                                    });
                                }}
                                disabled={!data}
                            >
                                <Image
                                    className="card__interact--replyIcon"
                                    src={ImgReply}
                                    alt="reply"
                                />
                                Reply
                            </button>
                        )}
                    </div>
                </form>
                {/* reply will always have a repliesToPostId */}
                {isDelete && (
                    <DeletePopup
                        cardId={cardData.id}
                        repliesToPostId={cardData.repliesToPostId!}
                        cancelCallback={setIsDelete}
                    />
                )}
            </>
        );
    }

    return content;
};

export default Card;
