"use client";
import Image from "next/image";
import "./addcomments.scss";
import fixImagePath from "../utils/fixImagePath";
import useStore from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { IHandleCommentPost } from "../api/comment/route";
import useFetch from "../hooks/useFetch";

const defaultUserImage = "./images/avatars/image-juliusomo.png";

const handleCommentPost = async (props: IHandleCommentPost) => {
    // const { authorId, content, repliesToPostId } = props
    // const { isError, isLoading, data } = useFetch({
    //     api: "/api/comment",
    //     request: { method: "POST", body: JSON.stringify(props) },
    // });
    // // fire and forget change likes/dislikes array for the current user in the DB
    // fetch("/api/comment", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(postCommentQuery),
    // });
};

const AddComment = () => {
    // scrolling to the reply menu on element render
    const commentRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        commentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // getting client-side store data
    const { png, webp } = useStore((state) => state.currentUserData.image);
    const {
        activePost,
        activePostUser,
        commentText,
        currentUserData,
        setRefreshRepliesBranchId,
    } = useStore();
    const currentUserImage = png ? png : webp ? webp : defaultUserImage;
    const isCurrentUsersPost = currentUserData.username === activePostUser;

    // text area content state
    const [replyText, setReplyText] = useState(
        isCurrentUsersPost ? commentText : `@${activePostUser} ${commentText}`
    );

    // api request inititation flag
    const [startFetch, setStartFetch] = useState(false);
    const { isError, isLoading, data } = useFetch({
        api: "/api/comment",
        request: {
            method: "POST",
            body: JSON.stringify({
                authorId: currentUserData.id,
                repliesToPostId: activePost!, // activePost is always defined when AddComment component is rendered
                content: replyText,
            }),
        },
        initiateFetchFlag: startFetch,
    });

    // if (data) {
    //     setRefreshRepliesBranchId(activePost!);
    // }

    return (
        <section
            className="addComment"
            ref={commentRef}
            style={startFetch ? { opacity: 0.5 } : {}}
        >
            <textarea
                className="addComment--textarea"
                placeholder="Add a comment..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="addComment__avatarWrapper">
                <Image
                    className="svg"
                    src={fixImagePath(currentUserImage)}
                    alt="your avatar"
                    width={64}
                    height={64}
                />
            </div>
            <div className="addComment__buttonWrapper">
                <button
                    className="addComment--sendButton"
                    onClick={
                        () => setStartFetch(true)
                        // handleCommentPost({
                        //     authorId: currentUserData.id,
                        //     repliesToPostId: activePost!, // activePost is always defined when AddComment component is rendered
                        //     content: replyText,
                        // })
                    }
                    disabled={startFetch}
                >
                    {isCurrentUsersPost ? "UPDATE" : "SEND"}
                </button>
            </div>
        </section>
    );
};

export default AddComment;
