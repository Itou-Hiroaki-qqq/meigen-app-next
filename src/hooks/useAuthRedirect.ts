"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function useAuthRedirect() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                setLoading(false);
            } else {
                router.push("/login");
                // loading は true のまま維持（リダイレクト完了までローディング表示）
            }
        });

        return () => unsubscribe();
    }, [router]);

    return { loading, user };
}
