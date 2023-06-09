"use client";
import "./replies.scss";
import Card from "./Card";
import AddComment from "./AddComment";
import React from "react";
import useStore from "@/store/store";
import { ICommentData } from "../utils/initDB";
import useFetch from "../hooks/useFetch";
import CardSkeleton from "./CardSkeleton";

const Replies = ({ cardId }: { cardId: string }) => {
    // api reply count data
    const { data: replyCount } = useFetch({
        api: "/api/reply",
        request: { method: "PUT", body: JSON.stringify({ id: cardId }) },
    });

    // api comment data
    const { data, isLoading, isError } = useFetch({
        api: "/api/reply",
        request: { method: "POST", body: JSON.stringify({ id: cardId }) },
    });
    // getting active post information from the client-side store
    const { activePost } = useStore();
    const { id: currentUserId } = useStore((state) => state.currentUserData);

    let content;
    if (isLoading) {
        content = replyCount ? (
            [...Array(replyCount)].map((_, index) => (
                <CardSkeleton key={index} />
            ))
        ) : (
            <></>
        );
    } else if (isError) {
        content = <pre>{JSON.stringify(isError, null, 2)}</pre>;
    } else {
        content = data.map((reply: ICommentData) => (
            <React.Fragment key={reply.id}>
                {activePost === reply.id ? (
                    reply.authorId === currentUserId ? (
                        <AddComment />
                    ) : (
                        <>
                            <Card key={reply.id} cardData={reply} />
                            <AddComment />{" "}
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
