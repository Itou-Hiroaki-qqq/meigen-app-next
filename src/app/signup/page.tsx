"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

function getSignupErrorMessage(code: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "このメールアドレスはすでに使用されています";
        case "auth/invalid-email":
            return "メールアドレスの形式が正しくありません";
        case "auth/weak-password":
            return "パスワードは6文字以上にしてください";
        default:
            return "登録に失敗しました";
    }
}

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
            router.push("/");
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(getSignupErrorMessage(err.code));
            } else {
                setError("登録に失敗しました");
            }
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
                    <Link href="/login" className="link text-blue-500">
                        ログインはこちら
                    </Link>
                </div>
            </div>
        </main>
    );
}
