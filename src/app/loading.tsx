import CardSkeleton from "./Components/CardSkeleton";
import styles from "./page.module.css";

export default function Loading() {
    return (
        <main className={styles.main}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </main>
    );
}
