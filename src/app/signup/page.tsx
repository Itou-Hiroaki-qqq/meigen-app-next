"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/"); // 登録後にトップページへ遷移
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
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
                        placeholder="パスワード（6文字以上）"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                    <button type="submit" className="btn btn-primary w-full">
                        登録
                    </button>
                </form>

                <div className="text-sm text-center mt-4">
                    すでにアカウントをお持ちですか？{" "}
                    <a href="/login" className="link text-blue-500">
                        ログインはこちら
                    </a>
                </div>
            </div>
        </main>
    );
}
