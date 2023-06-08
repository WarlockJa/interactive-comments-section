"use client";
import "./replies.scss";
import Card from "./Card";
import { IReply } from "../utils/initDB";
import AddComment from "./AddComment";
import React from "react";
import useStore from "@/store/store";

const Replies = ({ repliesArray }: { repliesArray: IReply[] }) => {
    // getting active post information from the client-side store
    const { activePost } = useStore();
    const { username: currentUserName } = useStore(
        (state) => state.currentUserData
    );
    // generating replies list
    const content = repliesArray.map((reply) => (
        <React.Fragment key={reply.id}>
            {activePost === reply.id ? (
                reply.user.username === currentUserName ? (
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
    return <div className="replies">{content}</div>;
};

export default Replies;
