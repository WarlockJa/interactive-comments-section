"use client";
import "./replies.scss";
import Card from "./Card";
import { ICommentData } from "../utils/initDB";
import AddComment from "./AddComment";
import React from "react";
import useStore from "@/store/store";
import Replies from "./Replies";

const Comment = ({ commentData }: { commentData: ICommentData }) => {
    // getting active post information from the client-side store
    const { activePost } = useStore();
    // generating replies list
    const content = (
        <>
            <Card cardData={commentData} />
            {/* normally replies would be hidden and fetched on demand */}
            <Replies cardId={commentData.id} />
            {activePost === commentData.id && <AddComment />}
        </>
    );
    return <div>{content}</div>;
};

export default Comment;
