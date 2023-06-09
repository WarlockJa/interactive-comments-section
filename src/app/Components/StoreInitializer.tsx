"use client";
// initializing store on the client's side
import useStore from "@/store/store";
import { useRef } from "react";
import { IUserData } from "../utils/initDB";

function StoreInitializer({ currentUserData }: { currentUserData: IUserData }) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState({ currentUserData });
        initialized.current = true;
    }
    return null;
}

export default StoreInitializer;
