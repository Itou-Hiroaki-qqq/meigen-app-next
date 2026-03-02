import { db, auth } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export type Quote = {
    text: string;
    author: string;
};

export async function addFavorite(quote: Quote) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("ログインしていません");
    }

    const ref = collection(db, "users", user.uid, "favorites");

    // 重複チェック
    const q = query(ref, where("text", "==", quote.text));
    const existing = await getDocs(q);
    if (!existing.empty) {
        throw new Error("すでにお気に入りに追加されています");
    }

    try {
        await addDoc(ref, quote);
    } catch (error) {
        console.error("Firestore 書き込みエラー:", error);
        throw new Error("お気に入りの追加に失敗しました");
    }
}
