"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import useAuthRedirect from "@/hooks/useAuthRedirect";

interface Favorite {
    id: string;
    text: string;
    author: string;
}

export default function FavoritesPage() {
    useAuthRedirect(); //未ログインならリダイレクト
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;

        const favRef = collection(db, "users", user.uid, "favorites");

        const unsubscribe = onSnapshot(favRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Favorite, "id">),
            }));
            setFavorites(data);
        });

        return () => unsubscribe();
    }, [user]);

    const removeFavorite = async (id: string) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, "users", user.uid, "favorites", id));
            alert("お気に入りを解除しました");
        } catch {
            alert("削除に失敗しました。");
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center p-6"
            style={{ backgroundImage: "url('/images/meijin-bg.png')" }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">
                        お気に入りリスト
                    </h1>
                    <a href="/" className="text-white underline">
                        ← ホームに戻る
                    </a>
                </div>

                {favorites.length === 0 ? (
                    <p className="text-gray-200 text-center max-w-xl mx-auto">
                        お気に入りはまだありません
                    </p>
                ) : (
                    <ul className="space-y-4 max-w-xl mx-auto">
                        {favorites.map((item) => (
                            <li
                                key={item.id}
                                className="bg-white/90 p-4 rounded shadow-md flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        「{item.text}」
                                    </p>
                                    <p className="text-gray-700 text-xs ml-3">— {item.author}</p>
                                </div>
                                <button
                                    onClick={() => removeFavorite(item.id)}
                                    className="bg-red-500 hover:bg-red-400 text-white font-bold text-sm px-2 py-1 rounded-lg shadow-md transition ml-2 [writing-mode:vertical-rl]"
                                >
                                    解除
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
