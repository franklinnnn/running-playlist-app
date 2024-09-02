import { Inter } from "next/font/google";
import "./globals.css";
import LoginPage from "./page";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PacePlaylist",
  description: "Get songs to listen to when running",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
