import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "元気がでる偉人の言葉アプリ",
  description: "偉人の名言をランダム表示・お気に入り登録できるアプリ",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
