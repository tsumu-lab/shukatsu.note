import type { Metadata } from "next";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import AuthButton from "./AuthButton";

// 見出し用フォント。Next.jsの型定義の都合で subsets は "latin" 指定ですが、
// 実際には日本語のグリフも一緒に読み込まれます（next/font/google の既知の仕様）
const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});

// 本文用フォント
const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "就活ノート",
  description: "就活の情報収集と思考整理を一元化する個人用ツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${zenMaru.variable} ${zenKaku.variable}`}>
      <body>
                <header className="px-6 py-3 flex justify-end">
          <AuthButton />
        </header>
        {children}
      </body>
    </html>
  );
}