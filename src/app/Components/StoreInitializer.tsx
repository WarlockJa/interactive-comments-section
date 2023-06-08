"use client";

// initializing store on the client's side
//

import useStore from "@/store/store";
import { useRef } from "react";
import { ICurrentUser } from "../utils/initDB";

function StoreInitializer({
    commentsThreadId,
    currentUserData,
}: {
    commentsThreadId: string;
    currentUserData: ICurrentUser;
}) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState({ commentsThreadId, currentUserData });
        initialized.current = true;
    }
    return null;
}

export default StoreInitializer;
