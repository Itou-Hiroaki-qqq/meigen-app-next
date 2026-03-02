"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

function getLoginErrorMessage(code: string): string {
    switch (code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "メールアドレスまたはパスワードが正しくありません";
        case "auth/invalid-email":
            return "メールアドレスの形式が正しくありません";
        case "auth/too-many-requests":
            return "試行回数が多すぎます。しばらくしてから再試行してください";
        default:
            return "ログインに失敗しました";
    }
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(getLoginErrorMessage(err.code));
            } else {
                setError("ログインに失敗しました");
            }
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                    <button type="submit" className="btn btn-primary w-full">
                        ログイン
                    </button>
                </form>

                <div className="text-sm text-center mt-4">
                    アカウントをお持ちでないですか？{" "}
                    <Link href="/signup" className="link text-blue-500">
                        新規登録
                    </Link>
                </div>
            </div>
        </main>
    );
}
