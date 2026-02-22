# 元気がでる偉人の言葉アプリ（meigen-app-next）

偉人の名言をランダム表示し、ログインしたユーザーがお気に入り登録できる Web アプリです。

## 機能

- **名言のランダム表示** … 「降臨」ボタンで名言を 1 件表示（フェードインアニメーション付き）
- **ユーザー認証** … Firebase Authentication（メール/パスワード）でログイン・新規登録
- **お気に入り** … 表示中の名言をお気に入りに追加し、Firestore に保存
- **お気に入りリスト** … 登録した名言の一覧表示・解除
- **静的エクスポート対応** … `output: "export"` で静的サイトとしてビルド可能

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | [Next.js](https://nextjs.org/) 16（App Router） |
| 言語 | TypeScript |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com/) 4, [DaisyUI](https://daisyui.com/) |
| BaaS | [Firebase](https://firebase.google.com/)（Authentication, Firestore） |

## プロジェクト構成

```
meigen-app-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # ルートレイアウト・メタデータ
│   │   ├── page.tsx        # ホーム（名言表示・お気に入り追加・ログアウト）
│   │   ├── login/page.tsx  # ログイン
│   │   ├── signup/page.tsx # 新規登録
│   │   └── favorites/page.tsx # お気に入りリスト
│   ├── data/
│   │   └── quotes.ts       # 名言データ（多数の名言を保持）
│   ├── lib/
│   │   ├── firebase.ts     # Firebase 初期化（Auth / Firestore）
│   │   └── favorites.ts    # お気に入り追加・取得
│   └── hooks/
│       └── useAuthRedirect.ts # 未ログイン時は /login へリダイレクト
├── public/                 # 静的ファイル（背景画像は public/images/ を想定）
├── next.config.ts          # output: "export", trailingSlash: true
└── package.json
```

## セットアップ

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <リポジトリURL>
cd meigen-app-next
npm install
```

### 2. Firebase の設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. **Authentication** を有効化し、メール/パスワードのサインイン方法を有効にする
3. **Firestore Database** を作成（本番ではルールを適切に設定すること）
4. プロジェクトの設定から「ウェブ」アプリを追加し、表示される `firebaseConfig` の値を控える

### 3. 環境変数

プロジェクトルートに `.env.local` を作成し、次の変数を設定してください。

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 背景画像（任意）

ホーム・お気に入りページで使用する背景画像を用意する場合、次のパスに配置してください。

- `public/images/meijin-bg.png`

配置しない場合は、スタイルで指定している `backgroundImage` が効かないため、必要に応じて CSS やコンポーネントを修正してください。

## 開発

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。未ログインの場合は `/login` にリダイレクトされます。

## ビルド・本番起動

```bash
npm run build
npm run start
```

静的エクスポートで配信する場合（例: GitHub Pages, 静的ホスティング）:

```bash
npm run build
```

ビルド後は `out/` に静的ファイルが出力されます。  
※ Firebase Auth / Firestore はクライアント側で動作するため、静的ホスティングでも利用可能です。Firestore のセキュリティルールと認証ドメインの設定は忘れずに行ってください。

## スクリプト一覧

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動（`next dev --webpack`） |
| `npm run build` | 本番ビルド（静的エクスポート） |
| `npm run start` | ビルド済みアプリの起動 |

## 注意事項

- `layout.tsx` の `metadata` で `robots: "noindex, nofollow"` を指定しているため、検索エンジンにはインデックスされません。公開用にする場合は変更を検討してください。
- Firestore のセキュリティルールは、認証済みユーザーが自身の `users/{uid}/favorites` のみ読み書きできるように設定することを推奨します。

## ライセンス

private リポジトリの場合はライセンスを明記していなければ「All Rights Reserved」などと README に追記することを推奨します。  
オープンソースで公開する場合は、LICENSE ファイルと README のライセンス表記を追加してください。
