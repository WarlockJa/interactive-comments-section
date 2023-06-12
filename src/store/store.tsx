import { ICommentData, IUserData, IUserRatings } from "@/app/utils/initDB";
import { create } from "zustand";

interface IRepliesCount {
    commentId: string;
    count: number;
}

interface IStore {
    activePost: string | undefined;
    setActivePost: (activePost: string | undefined) => void;
    activePostUser: string;
    setActivePostUser: (activePostUser: string) => void;
    commentText: string;
    setCommentText: (commentText: string) => void;
    repliesCount: IRepliesCount[];
    addReplyCount: (newReplyCount: IRepliesCount) => void;
    increaseReplyCount: (commentId: string) => void;
    decreaseReplyCount: (commentId: string) => void;
    removeReplyCount: (commentId: string) => void;
    currentUserData: IUserData;
    comments: ICommentData[];
    addComments: (newComments: ICommentData[]) => void;
    deleteComment: (commentId: string) => void;
    updateComment: (commentId: string, newContent: string) => void;
    users: IUserData[];
    addUser: (user: IUserData) => void;
    setCurrentUserRatings: (currentUserRatings: IUserRatings[]) => void;
}

const useStore = create<IStore>((set) => ({
    activePost: undefined,
    setActivePost: (activePost) =>
        set((state) => ({
            ...state,
            activePost,
        })),

    activePostUser: "",
    setActivePostUser: (activePostUser) =>
        set((state) => ({
            ...state,
            activePostUser,
        })),

    commentText: "",
    setCommentText: (commentText) =>
        set((state) => ({
            ...state,
            commentText,
        })),

    currentUserData: {
        id: "",
        image: {
            png: "",
            webp: "",
        },
        username: "",
        userRatings: [],
    },

    repliesCount: [],
    addReplyCount: (newReplyCount) => {
        set((state) => ({
            ...state,
            repliesCount:
                state.repliesCount.findIndex(
                    (reply) => reply.commentId === newReplyCount.commentId
                ) === -1
                    ? [...state.repliesCount, newReplyCount]
                    : state.repliesCount.map((reply) =>
                          reply.commentId === newReplyCount.commentId
                              ? newReplyCount
                              : reply
                      ),
        }));
    },
    increaseReplyCount: (commentId) => {
        set((state) => ({
            ...state,
            repliesCount: state.repliesCount.map((reply) =>
                reply.commentId === commentId
                    ? { ...reply, count: reply.count + 1 }
                    : reply
            ),
        }));
    },
    decreaseReplyCount: (commentId) => {
        set((state) => ({
            ...state,
            repliesCount: state.repliesCount.map((reply) =>
                reply.commentId === commentId
                    ? { ...reply, count: reply.count - 1 }
                    : reply
            ),
        }));
    },
    removeReplyCount: (commentId) => {
        set((state) => ({
            ...state,
            repliesCount: state.repliesCount.filter(
                (reply) => reply.commentId !== commentId
            ),
        }));
    },

    comments: [],
    addComments: (newComments) => {
        set((state) => ({
            ...state,
            comments: [...state.comments, ...newComments],
        }));
    },
    deleteComment: (commentId) => {
        set((state) => ({
            ...state,
            comments: state.comments.filter(
                (comment) => comment.id !== commentId
            ),
        }));
    },
    updateComment: (commentId, newContent) => {
        set((state) => ({
            ...state,
            comments: state.comments.map((comment) =>
                comment.id === commentId
                    ? { ...comment, content: newContent, updatedAt: new Date() }
                    : comment
            ),
        }));
    },

    users: [],
    addUser: (user) => {
        set((state) => ({
            ...state,
            users: [...state.users, user],
        }));
    },

    // refreshRepliesBranchId: null,
    // setRefreshRepliesBranchId: (refreshRepliesBranchId) => {
    //     set((state) => ({
    //         ...state,
    //         refreshRepliesBranchId,
    //     }));
    // },

    // setCurrentUserData: (currentUserData) =>
    //     set((state) => ({
    //         ...state,
    //         currentUserData,
    //     })),

    setCurrentUserRatings: (currentUserRatings) =>
        set((state) => ({
            ...state,
            currentUserData: {
                ...state.currentUserData,
                userRatings: currentUserRatings,
            },
        })),
}));

export default useStore;
