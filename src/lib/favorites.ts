import { db, auth } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

// 名言データ型
export type Quote = {
    text: string;
    author: string;
};

// お気に入りを保存
export async function addFavorite(quote: Quote) {
    // Firebase Authの状態を待つ
    const user = await new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            unsubscribe(); // 一度だけ実行
            resolve(u);
        });
    });

    if (!user) {
        throw new Error("ログインしていません");
    }

    try {
        const ref = collection(db, "users", user.uid, "favorites");
        console.log("書き込み先UID:", user.uid);
        await addDoc(ref, quote);
    } catch (error) {
        console.error("Firestore 書き込みエラー:", error);
        throw new Error("お気に入りの追加に失敗しました");
    }
}

// お気に入りを取得
export async function getFavorites(): Promise<Quote[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("ログインしていません");

    try {
        const ref = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(ref);
        return snapshot.docs.map((doc) => doc.data() as Quote);
    } catch (error) {
        console.error("Firestore getDocs error:", error);
        return [];
    }
}
