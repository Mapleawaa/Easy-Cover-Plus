import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyCover - AcoFork",
  description: "EasyCover - AcoFork",
  icons: {
    icon: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/npm/misans-vf@1.0.0/lib/MiSans.min.css" />
        <link href="https://fonts.cdnfonts.com/css/harmonyos-sans" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.1.1/400.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.1.1/400-italic.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.1.1/700.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.1.1/800.css" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
