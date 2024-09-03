import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

import { Header } from "../components/header";
import { Footer } from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PacePlaylist",
  description: "Generate playlists that match your running tempo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>PacePlaylist - Running Playlists Tailored to Your Pace</title>
        <meta
          name="description"
          content="Generate playlists that match your running tempo. Choose your pace and let the music drive your run."
        />
        <meta
          name="keywords"
          content="running playlists, tempo music, workout music, running apps, fitness playlists"
        />
        <meta name="author" content="Franklin Assa" />

        {/* Open Graph tags for social media */}
        <meta
          property="og:title"
          content="PacePlaylist - Custom Running Playlists"
        />
        <meta
          property="og:description"
          content="Generate playlists that match your running tempo."
        />
        <meta property="og:image" content="/app-img.png" />
        <meta property="og:url" content="https://paceplaylist.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards for Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PacePlaylist - Custom Running Playlists"
        />
        <meta
          name="twitter:description"
          content="Generate playlists that match your running tempo."
        />
        <meta name="twitter:image" content="/app-img.png" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://paceplaylist.vercel.app" />
      </Head>

      <body className={inter.className} data-theme="sunset">
        <main className="relative flex flex-col min-h-screen items-center justify-center">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
