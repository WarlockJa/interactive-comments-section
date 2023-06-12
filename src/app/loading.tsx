import CardSkeleton from "./Components/CardSkeleton";
import styles from "./page.module.scss";

export default function Loading() {
    return (
        <main className={styles.main}>
            <div className={styles.wrapper}>
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </main>
    );
}
