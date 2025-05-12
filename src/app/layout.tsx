/** @format */
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.jicklampago.xyz"),
  title: {
    default: "Jick Lampago - Frontend Developer | React & Next.js Expert",
    template: "%s | Jick Lampago",
  },
  description:
    "Jick Lampago is a frontend developer with 5+ years of experience, specializing in React, Next.js, and modern web development. Expert in creating performant, accessible web experiences.",
  keywords: [
    "Jick Lampago",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Web Developer",
    "JavaScript Expert",
    "TypeScript Developer",
    "UI/UX Developer",
    "Frontend Engineer Philippines",
  ],
  authors: [{ name: "Jick Lampago" }],
  creator: "Jick Lampago",
  publisher: "Jick Lampago",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.jicklampago.xyz",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.jicklampago.xyz",
    title: "Jick Lampago - Frontend Developer | React & Next.js Expert",
    description:
      "Frontend developer with 5+ years of experience in React and Next.js. Creating performant, accessible web experiences.",
    siteName: "Jick Lampago Portfolio",
    images: [
      {
        url: "/pf.png",
        width: 1200,
        height: 630,
        alt: "Jick Lampago - Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jick Lampago - Frontend Developer | React & Next.js Expert",
    description:
      "Frontend developer specializing in React and Next.js applications. Building modern web experiences.",
    images: ["/pf.png"],
    creator: "@jicklampago",
  },
  verification: {
    google: "your-google-verification-code", // You'll need to add your Google Search Console verification code
  },
  icons: {
    icon: "/code.svg",
    shortcut: "/code.svg",
    apple: "/code.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
