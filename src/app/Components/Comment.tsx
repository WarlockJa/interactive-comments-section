"use client";
import "./replies.scss";
import Card from "./Card";
import { ICommentData } from "../utils/initDB";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import Replies from "./Replies";
import "./comment.scss";
import AddReply from "./AddReply";

const Comment = ({ commentData }: { commentData: ICommentData }) => {
    // replies hidden state
    const [isFolded, setIsFolded] = useState(true);
    // getting active post information from the client-side store
    const { activePost, repliesCount, addReplyCount } = useStore();

    // looking for the count in the store
    const data = repliesCount.find(
        (comment) => comment.commentId === commentData.id
    );

    // fetching initial reply count
    useEffect(() => {
        if (!data) {
            fetch(`/api/reply?id=${commentData.id}`)
                .then((result) => result.json())
                .then((json) =>
                    addReplyCount({ commentId: commentData.id, count: json })
                );
        }
    });

    // generating replies list
    const content = (
        <>
            <Card cardData={commentData} unfoldReplies={setIsFolded} />
            {/* replies are hidden and fetched on demand showing only count */}
            {data && data && data?.count !== 0 && (
                <button
                    className="comment--button"
                    onClick={() => setIsFolded((prev) => !prev)}
                >
                    {isFolded ? "+".concat(data.count.toString()) : "-"}
                </button>
            )}
            {!isFolded && (
                <Replies
                    cardId={commentData.id}
                    replyCount={data ? data.count : 0}
                />
            )}
            {activePost === commentData.id && <AddReply />}
        </>
    );
    return <div>{content}</div>;
};

export default Comment;
