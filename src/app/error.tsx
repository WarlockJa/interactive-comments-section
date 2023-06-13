"use client";
import styles from "./page.module.scss";
import ErrorImage from "../../public/images/spiffingbrit.webp";
import Image from "next/image";

// error screen in case there's a proble wih DB access
// possible cause is DB reinitialized
// I forgot about this project and changed DB access requisites
// contact me at Roman.S@warlockja.ru for assistance
const error = ({ error }: { error: Error }) => {
    return (
        <main className={`${styles.error} ${styles.main}`}>
            <h1>M-m-m-yes. &apos;Tis but an error. *sips tea spiffingly*</h1>
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
