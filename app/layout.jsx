import { Inter } from "next/font/google";
import "./globals.css";
import LoginPage from "./page";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PacePlaylist",
  description: "Get songs to listen to when running",
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
        <meta name="author" content="Your Name" />

        {/* Open Graph tags for social media */}
        <meta
          property="og:title"
          content="PacePlaylist - Custom Running Playlists"
        />
        <meta
          property="og:description"
          content="Generate playlists that match your running tempo."
        />
        <meta property="og:image" content="/images/your-image.png" />
        <meta property="og:url" content="https://www.yourapp.com" />
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
        <meta name="twitter:image" content="/images/your-image.png" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.yourapp.com" />
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
