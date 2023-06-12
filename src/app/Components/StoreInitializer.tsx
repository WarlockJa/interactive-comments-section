"use client";
// initializing store on the client's side
import useStore from "@/store/store";
import { useRef } from "react";
import { ICommentData, IUserData } from "../utils/initDB";

function StoreInitializer({
    currentUserData,
    comments,
}: {
    currentUserData: IUserData;
    comments: ICommentData[];
}) {
    // using ref to limit store initialization to one time
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState({ currentUserData, comments });
        initialized.current = true;
    }
    return null;
}

export default StoreInitializer;
