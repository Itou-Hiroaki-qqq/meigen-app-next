"use client";

import { useState } from "react";
import { quotes } from "@/data/quotes";
import { addFavorite } from "@/lib/favorites";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function HomePage() {
  useAuthRedirect(); //未ログインならリダイレクト
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(null); // リセットしてから再描画でアニメーション適用
    setTimeout(() => {
      setQuote(quotes[randomIndex]);
      setMessage("");
    }, 50);
  };

  const handleAddFavorite = async () => {
    if (!quote) return;
    try {
      await addFavorite(quote);
      setMessage("お気に入りに追加しました！");
    } catch {
      setMessage("追加に失敗しました。ログインしていますか？");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ログアウトしました");
      router.push("/login");
    } catch {
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-down {
          animation: fadeDown 0.4s ease-out;
        }
      `}</style>

      <div
        className="relative min-h-screen bg-cover bg-center text-center p-6"
        style={{ backgroundImage: "url('/images/meijin-bg.png')" }}
      >
        {/* 背景オーバーレイ */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* メインコンテンツ */}
        <div className="relative z-10">
          {/* タイトル */}
          <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md">
            元気がでる偉人の言葉アプリ
          </h1>

          {/* 降臨ボタン */}
          <button
            onClick={generateQuote}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded shadow-lg"
          >
            降臨
          </button>

          {/* お気に入りリストリンク */}
          <div className="text-right mt-4 mr-2">
            <a href="/favorites" className="text-sm text-white underline">
              お気に入りリスト
            </a>
          </div>

          {/* 名言表示カード */}
          {quote && (
            <div className="fade-down mt-8 mx-auto max-w-xl px-6 py-4 bg-white/90 rounded-lg shadow-md">
              <p className="text-lg font-semibold mb-2">「{quote.text}」</p>
              <p className="text-sm text-gray-700 text-center mb-4">– {quote.author}</p>
              <button
                onClick={handleAddFavorite}
                className="btn btn-sm btn-outline btn-primary"
              >
                お気に入りに追加
              </button>
              {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
            </div>
          )}
        </div>

        {/* ログアウトボタン（右下固定） */}
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-lg shadow-md transition z-20"
        >
          ログアウト
        </button>
      </div>
    </>
  );
}
