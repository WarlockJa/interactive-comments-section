import { IUserData, IUserRatings } from "@/app/utils/initDB";
import { create } from "zustand";

interface IStore {
    activePost: string | undefined;
    setActivePost: (activePost: string | undefined) => void;
    activePostUser: string;
    setActivePostUser: (activePostUser: string) => void;
    commentText: string;
    setCommentText: (commentText: string) => void;
    commentsThreadId: string;
    // setCommentsThreadId: (commentsThreadId: string) => void;
    currentUserData: IUserData;
    // setCurrentUserData: (currentUserData: ICurrentUser) => void;
    setCurrentUserRatings: (currentUserRatings: IUserRatings[]) => void;
}

const useStore = create<IStore>((set) => ({
    commentsThreadId: "",
    // setCommentsThreadId: (commentsThreadId) => {
    //     set((state) => ({
    //         ...state,
    //         commentsThreadId,
    //     }));
    // },
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
