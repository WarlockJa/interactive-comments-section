"use client";
import Image from "next/image";
import "./addreply.scss";
import fixImagePath from "../utils/fixImagePath";
import useStore from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { postAddAction } from "@/lib/actions";

const defaultUserImage = "./images/avatars/image-juliusomo.png";

const AddReply = () => {
    // scrolling to the reply menu on element render
    const commentRef = useRef<HTMLFormElement | null>(null);
    useEffect(() => {
        commentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // getting client-side store data
    const { png, webp } = useStore((state) => state.currentUserData.image);
    const {
        activePost,
        setActivePost,
        activePostUser,
        commentText,
        setCommentText,
        currentUserData,
        increaseReplyCount,
        comments,
        addComments,
    } = useStore();
    const currentUserImage = png ? png : webp ? webp : defaultUserImage;
    const isCurrentUsersPost = currentUserData.username === activePostUser;

    // flag to disable input if submit button is pressed
    const [startFetch, setStartFetch] = useState(false);

    return (
        <form
            className="addComment"
            style={startFetch ? { opacity: 0.5 } : {}}
            ref={commentRef}
        >
            <textarea
                name="textarea"
                className="addComment--textarea"
                placeholder="Add a comment..."
                defaultValue={`@${activePostUser} ${commentText}`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
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
                    className={
                        startFetch || commentText === ""
                            ? "addComment--sendButton disabled"
                            : "addComment--sendButton"
                    }
                    formAction={async () => {
                        setStartFetch(true);
                        //finding root comment id
                        const rootId = comments.find(
                            (comment) => comment.id === activePost
                        )?.repliesToPostId;

                        // creating a new post
                        // using server action to add a new reply to the DB
                        const newPost = await postAddAction({
                            authorId: currentUserData.id,
                            repliesToPostId: rootId ? rootId : activePost!, // activePost is always defined when AddComment component is rendered
                            content: commentText,
                        });
                        // adding new reply to the store
                        addComments([newPost]);
                        // increasing store data about comment count
                        increaseReplyCount(activePost!);
                        setActivePost(undefined);
                    }}
                    disabled={startFetch || commentText === ""}
                >
                    SEND
                </button>
            </div>
        </form>
    );
};

export default AddReply;
