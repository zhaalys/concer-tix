import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIX: Konser Musik, Festival, Pertunjukan Seni",
  description:
    "Beli tiket konser, festival, pertunjukan seni, dan ribuan event seru lainnya di Concer TIX. Temukan event favoritmu sekarang!",
  keywords: "tiket, konser, festival, event, indonesia, concer tix",
  icons: {
    icon: "/logo/tix_logo.png?v=3",
    shortcut: "/logo/tix_logo.png?v=3",
    apple: "/logo/tix_logo.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo/tix_logo.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/logo/tix_logo.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/tix_logo.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
