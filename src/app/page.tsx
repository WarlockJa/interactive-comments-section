import styles from "./page.module.scss";
import React from "react";
import { ICommentData, initDB } from "./utils/initDB";
import StoreInitializer from "./Components/StoreInitializer";
import Comment from "./Components/Comment";

export default async function Home() {
    // initializing DB connection
    const { currentUser, comments } = await initDB();

    // handling errors
    if (!currentUser || !comments)
        throw new Error("There was an error connecting to the database");

    // initializing server side store. not needed in this project
    // useStore.setState({ commentsThreadId: data.id });

    // processing fetched data
    const content = comments ? (
        comments
            .filter((comment) => !comment.repliesToPostId)
            .sort((a, b) => (a.score < b.score ? 1 : -1))
            .map((item: ICommentData) => (
                <Comment key={item.id} commentData={item} />
            ))
    ) : (
        // a plug for the scenario where DB contains valid object but it is empty
        // in this particular project it can never happen
        <h1>Data not found</h1>
    );
    return (
        <main className={styles.main}>
            {/* passing DB info to the client-side store */}
            <StoreInitializer
                currentUserData={currentUser}
                comments={comments}
            />
            <div className={styles.wrapper}>{content}</div>
        </main>
    );
}
