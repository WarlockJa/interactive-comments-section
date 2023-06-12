import React from "react";
import "./deletepopup.scss";
import useStore from "@/store/store";
import { postDeleteAction } from "@/lib/actions";

const DeletePopup = ({
    cardId,
    repliesToPostId,
    cancelCallback,
}: {
    cardId: string;
    repliesToPostId: string;
    cancelCallback: (value: boolean) => void;
}) => {
    const { deleteComment, decreaseReplyCount, setActivePost } = useStore();
    return (
        <form className="deletePopup">
            <div className="deletePopup__deleteWrapper">
                <h1 className="deletePopup--title">Delete comment</h1>
                <p className="deletePopup--text">
                    Are you sure you want to delete this comment? This will
                    remove the comment and it can't be undone.
                </p>
                <div className="deletePopup__controls">
                    <button
                        onClick={() => cancelCallback(false)}
                        className="deletePopup__controls--button deletePopup__controls--no"
                    >
                        NO, CANCEL
                    </button>
                    <button
                        formAction={() => {
                            postDeleteAction(cardId);
                            deleteComment(cardId);
                            decreaseReplyCount(repliesToPostId);
                            setActivePost(undefined);
                        }}
                        className="deletePopup__controls--button deletePopup__controls--yes"
                    >
                        YES, DELETE
                    </button>
                </div>
            </div>
        </form>
    );
};

export default DeletePopup;
