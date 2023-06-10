"use client";
import "./replies.scss";
import Card from "./Card";
import AddComment from "./AddComment";
import React, { useEffect } from "react";
import useStore from "@/store/store";
import { ICommentData } from "../utils/initDB";
import useFetch from "../hooks/useFetch";
import CardSkeleton from "./CardSkeleton";

const Replies = ({ cardId }: { cardId: string }) => {
    // getting active post information from the client-side store
    const { activePost } = useStore();
    const { id: currentUserId } = useStore((state) => state.currentUserData);

    useEffect(() => {}, []);

    //refresh replies state
    // const [refreshRepliesFlag, setRefreshRepliesFlag] = useState(true);
    // if (refreshRepliesBranchId === cardId) setRefreshRepliesFlag(true);

    // api reply count data
    const { data: replyCount } = useFetch({
        api: "/api/reply",
        request: { method: "PUT", body: JSON.stringify({ id: cardId }) },
        initiateFetchFlag: true,
    });

    // api comment data
    const { data, isLoading, isError } = useFetch({
        api: "/api/reply",
        request: { method: "POST", body: JSON.stringify({ id: cardId }) },
        initiateFetchFlag: true,
    });

    // setRefreshRepliesFlag(() => false);
    // setRefreshRepliesBranchId(null);

    // forming replies list
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
