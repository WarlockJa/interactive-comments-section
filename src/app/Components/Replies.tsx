"use client";
import "./replies.scss";
import Card from "./Card";
import AddReply from "./AddReply";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { ICommentData } from "../utils/initDB";
import CardSkeleton from "./CardSkeleton";

const Replies = ({
    cardId,
    replyCount,
}: {
    cardId: string;
    replyCount: number;
}) => {
    // getting active post information from the client-side store
    const { activePost, comments, addComments } = useStore();
    const { id: currentUserId } = useStore((state) => state.currentUserData);
    const data = comments.filter(
        (comment) => comment.repliesToPostId === cardId
    );
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        if (!data) {
            console.log(comments);
            fetch("/api/reply", {
                method: "POST",
                body: JSON.stringify({ id: cardId }),
            })
                .then((result) => result.json())
                .then((json) => addComments(json))
                .catch((error) => setIsError(error));
        }
    }, []);

    // forming replies list
    let content;
    if (!data) {
        content = [...Array(replyCount)].map((_, index) => (
            <CardSkeleton key={index} />
        ));
    } else if (isError) {
        content = <p>{JSON.stringify(isError)}</p>;
    } else {
        content = data
            .sort((a: ICommentData, b: ICommentData) =>
                a.updatedAt > b.updatedAt ? 1 : -1
            )
            .map((reply: ICommentData) => (
                <React.Fragment key={reply.id}>
                    {activePost === reply.id ? (
                        reply.authorId === currentUserId ? (
                            <Card key={reply.id} cardData={reply} />
                        ) : (
                            <>
                                <Card key={reply.id} cardData={reply} />
                                <AddReply />{" "}
                            </>
                        )
                    ) : (
                        <Card key={reply.id} cardData={reply} />
                    )}
                </React.Fragment>
            ));
    }

    return <div className="replies">{content}</div>;
};

export default Replies;
