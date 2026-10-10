import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { GameProvider } from "@/lib/game-engine/GameContext";
import { AppShell } from "@/components/game/AppShell";

export const metadata: Metadata = {
  title: "YouTuber Simulator — симулятор ютубера",
  description: "Создай канал, оформи его в SVG-конструкторе, снимай видео, продвигай их и продавай каналы холдингам.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080d",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="overflow-hidden bg-[#07080d] font-sans text-slate-100 antialiased">
        <GameProvider>
          <AppShell>{children}</AppShell>
        </GameProvider>
      </body>
    </html>
  );
}
