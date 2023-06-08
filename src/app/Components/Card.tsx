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
import { useState } from "react";
import { ICommentData, IUserRatings } from "../utils/initDB";
import useStore from "@/store/store";
import { IChangeRatingBody } from "../api/rating/route";

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

const Card = ({ cardData }: { cardData: ICommentData }) => {
    // getting client-side store data
    const { username, userRatings } = useStore(
        (state) => state.currentUserData
    );
    const { setActivePost, setCommentText, setActivePostUser } = useStore();
    // current user is the author of the post flag
    const ownersCard = cardData.user.username === username;
    // rating tracking state
    const [ratingChange, setRatingChange] = useState<number>(
        getUserCardRating({
            id: cardData.id,
            userRatings: userRatings,
        })
    );
    // client-side store access
    const { commentsThreadId } = useStore();

    // sending put ruequest to the api simultaniously changing local state as an optimistic update
    const handleRatingChange = (newRating: number) => {
        setRatingChange(newRating);
        putRatingChangeRequest({
            id: commentsThreadId,
            postId: cardData.id,
            rating: newRating,
        });
    };

    // providing/changing data for the AddComment component in the store
    const handleReplyEdit = ({
        id,
        text,
        user,
    }: {
        id: string;
        text: string;
        user: string;
    }) => {
        setCommentText(text);
        setActivePost(id);
        setActivePostUser(user);
    };

    return (
        <div className="card">
            <div className="card__header">
                <div className="card__header__imgWrapper">
                    <Image
                        className="card__header--avatar"
                        src={fixImagePath(cardData.user.image.png)}
                        alt="user avatar"
                        width={64}
                        height={64}
                    />
                </div>
                <p className="card__header--username">
                    {cardData.user.username}
                </p>
                {ownersCard && <p className="card__header--ownerFlag">you</p>}
                <div className="card__header--date">
                    {formatDistance(new Date(cardData.createdAt), new Date(), {
                        addSuffix: true,
                    })}
                </div>
            </div>
            <p className="card__comment">{cardData.content}</p>
            <div className="card__rating">
                <div className="card__rating__wrapper">
                    <button
                        onClick={() =>
                            ratingChange === 1
                                ? handleRatingChange(0)
                                : handleRatingChange(1)
                        }
                        className={
                            ratingChange !== 1
                                ? "card__rating--button card__rating--buttonLike"
                                : "card__rating--button card__rating--buttonLike selected"
                        }
                    >
                        <Image className="svg" src={ImgPlus} alt="like" />
                    </button>
                    <div className="card__rating--rating">
                        {cardData.score + ratingChange}
                    </div>
                    <button
                        onClick={() =>
                            ratingChange === -1
                                ? handleRatingChange(0)
                                : handleRatingChange(-1)
                        }
                        className={
                            ratingChange !== -1
                                ? "card__rating--button card__rating--buttonDislike"
                                : "card__rating--button card__rating--buttonDislike selected"
                        }
                    >
                        <Image className="svg" src={ImgMinus} alt="dislike" />
                    </button>
                </div>
            </div>
            <div className="card__interact">
                {ownersCard ? (
                    <div>
                        <button className="card__interact--button card__interact--buttonDelete">
                            <Image
                                className="card__interact--deleteIcon"
                                src={ImgDelete}
                                alt="delete comment"
                            />
                            Delete
                        </button>
                        <button
                            className="card__interact--button card__interact--buttonEdit"
                            onClick={() =>
                                handleReplyEdit({
                                    id: cardData.id,
                                    text: cardData.content,
                                    user: cardData.user.username,
                                })
                            }
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
                        onClick={() =>
                            handleReplyEdit({
                                id: cardData.id,
                                text: "",
                                user: cardData.user.username,
                            })
                        }
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
        </div>
    );
};

export default Card;