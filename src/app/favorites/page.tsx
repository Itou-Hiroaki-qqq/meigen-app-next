"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc,
} from "firebase/firestore";
import useAuthRedirect from "@/hooks/useAuthRedirect";

interface Favorite {
    id: string;
    text: string;
    author: string;
}

export default function FavoritesPage() {
    const { loading, user } = useAuthRedirect();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [deleteMsg, setDeleteMsg] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (!user) return;

        const favRef = collection(db, "users", user.uid, "favorites");

        const unsubscribe = onSnapshot(favRef, (snapshot) => {
            const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Favorite, "id">),
            }));
            setFavorites(data);
        });

        return () => unsubscribe();
    }, [user]);

    const removeFavorite = async (id: string) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, "users", user.uid, "favorites", id));
            setDeleteMsg({ text: "お気に入りを解除しました", ok: true });
        } catch {
            setDeleteMsg({ text: "削除に失敗しました。", ok: false });
        }

        setTimeout(() => setDeleteMsg(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                読み込み中...
            </div>
        );
    }

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
                    <Link href="/" className="text-white underline">
                        ← ホームに戻る
                    </Link>
                </div>

                {deleteMsg && (
                    <p className={`text-center mb-4 text-sm ${deleteMsg.ok ? "text-green-300" : "text-red-300"}`}>
                        {deleteMsg.text}
                    </p>
                )}

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
                                    className="btn btn-sm btn-error ml-2"
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
