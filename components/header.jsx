"use client";
import { useAccessToken } from "../hooks/useAccessToken";
import { useUser } from "../hooks/useUser";
import Link from "next/link";
import Head from "next/head";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Header = () => {
  const { accessToken } = useAccessToken();
  const { user, errorUser, loadingUser } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://www.yourapp.com",
            name: "PacePlaylist",
            description: "Generate playlists that match your running tempo.",
          })}
        </script>
      </Head>
      <div>
        <ToastContainer />
        <div className="text-4xl text-center font-display uppercase italic mt-2 mb-12">
          <Link href={accessToken ? "/dashboard" : "/"}>🏃 PacePlaylist </Link>
        </div>
        <div className="flex items-center justify-between md:w-[36rem] w-screen px-2">
          {accessToken ? (
            <>
              {loadingUser ? (
                <h1 className="skeleton w-32 h-8"></h1>
              ) : (
                <h1 className="text-2xl font-display capitalize italic">
                  hello {user?.display_name}!
                </h1>
              )}
            </>
          ) : (
            <h1 className="text-2xl font-display capitalize italic">hello!</h1>
          )}
          <div className="flex gap-2 items-center font-body">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                className="theme-controller"
                value="corporate"
              />
              <div className="swap-off">☀️</div>
              <div className="swap-on">🌙</div>
            </label>
            {accessToken ? (
              <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link href="/api/auth/login">
                <button className="btn btn-primary btn-sm">Login</button>
              </Link>
            )}
          </div>
        </div>
        <hr className="h-px my-6 bg-secondary/20 border-0" />
      </div>
    </>
  );
};
