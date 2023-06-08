import "./globals.css";
import { Roboto, Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

export const metadata = {
    title: "Interactive Comment Section",
    description: "Frontend Mentor challenge",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={rubik.className}>{children}</body>
        </html>
    );
}
