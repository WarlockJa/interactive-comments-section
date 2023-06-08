"use client";
import styles from "./page.module.css";
import ErrorImage from "../../public/images/spiffingbrit.webp";
import Image from "next/image";

const error = ({ error }: { error: Error }) => {
    return (
        <main className={`${styles.error} ${styles.main}`}>
            <h1>M-m-m-yes. 'Tis but an error. *sips tea spiffingly*</h1>
            <p>{error.message}</p>
            <Image src={ErrorImage} alt="error" />
            <button
                className={styles.errorButton}
                onClick={() => location.reload()}
            >
                Try again
            </button>
        </main>
    );
};

export default error;
