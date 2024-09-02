"use client";
import React from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { useUser } from "../hooks/useUser";
import Link from "next/link";
import Head from "next/head";

export const Header = () => {
  const { accessToken } = useAccessToken();
  const { user, error, loading } = useUser();

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
        <div className="text-4xl text-center font-display uppercase italic mt-2 mb-12">
          🏃 PacePlaylist
        </div>
        <div className="flex items-center justify-between md:w-[36rem] w-screen px-2">
          {accessToken ? (
            <>
              {loading ? (
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
          <div className="flex gap-2 items-center">
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
