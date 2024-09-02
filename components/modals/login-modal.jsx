import Link from "next/link";
import React from "react";

export const LoginModal = () => {
  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box">
        <h1 className="text-4xl text-center font-display uppercase italic">
          🏃 PacePlaylist
        </h1>
        <p className="font-body text-center text-sm">
          Login to save your playlist
        </p>

        <div className="w-full flex justify-center mt-12">
          <Link href="/api/auth/login">
            <button className="btn btn-primary">Login with Spotify</button>
          </Link>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
