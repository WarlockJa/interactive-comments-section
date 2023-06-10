import { ICommentData, IUserData, IUserRatings } from "@/app/utils/initDB";
import { create } from "zustand";

interface IReplyData {
    commentId: string;
    replyCount: number;
    reply: ICommentData;
}

interface IStore {
    activePost: string | undefined;
    setActivePost: (activePost: string | undefined) => void;
    activePostUser: string;
    setActivePostUser: (activePostUser: string) => void;
    commentText: string;
    setCommentText: (commentText: string) => void;
    // refreshRepliesBranchId: string | null;
    // setRefreshRepliesBranchId: (refreshRepliesBranchId: string | null) => void;
    // setCurrentUserData: (currentUserData: IUserData) => void;
    currentUserData: IUserData;
    comments: ICommentData[];
    replies: IReplyData[];
    setCurrentUserRatings: (currentUserRatings: IUserRatings[]) => void;
}

const useStore = create<IStore>((set) => ({
    activePost: undefined,
    setActivePost: (activePost: string | undefined) =>
        set((state) => ({
            ...state,
            activePost,
        })),

    activePostUser: "",
    setActivePostUser: (activePostUser: string) =>
        set((state) => ({
            ...state,
            activePostUser,
        })),

    commentText: "",
    setCommentText: (commentText: string) =>
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

    comments: [],
    replies: [],

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
