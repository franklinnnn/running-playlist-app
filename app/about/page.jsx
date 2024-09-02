import Link from "next/link";
import React from "react";

const AboutPage = () => {
  return (
    <div className="h-full md:max-h-[30rem] overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral w-screen md:max-w-[36rem] px-2 font-body">
      <h1 className="text-4xl font-display uppercase italic text-center">
        About
      </h1>
      <div>
        <p>
          PacePlaylist generates playlists tailored to your running pace,
          helping you find the rhythm that keeps you motivated.
        </p>
        <br />
        <p>
          Using the Spotify Web API, we've made it super easy for you to
          discover fresh tracks without any hassle. Just dive in, explore some
          randomly generated playlists, and if you find something you love, you
          can save it to your Spotify account. No login required to start, just
          great music to keep you going.
        </p>
      </div>
      <br />
      <div>
        <h2 className="text-3xl font-display uppercase italic text-center">
          FAQ
        </h2>
        <h3 className="text-xl mt-4 mb-1">
          Do I need a Spotify account to use PacePlaylist?
        </h3>
        <p>
          No, you can get randomly generated playlists without logging in.
          However, if you want to save tracks to your Spotify account, you will
          need to log in.
        </p>

        <h3 className="text-xl  mt-4 mb-1">
          Does PacePlaylist collect any personal information?
        </h3>
        <p>
          No, PacePlaylist does not collect any personal information or track
          your activity. For more information, read PacePlaylist's{" "}
          <Link href="/privacy" className="text-secondary hover:text-primary">
            privacy policy
          </Link>
          .
        </p>

        <h3 className="text-xl  mt-4 mb-1">How are the playlists generated?</h3>
        <p>
          The playlists are generated randomly using the Spotify Web API,
          ensuring you always get a fresh mix of tracks. You can refine your
          playlist generation by specifying certain features like tempo or
          energy.
        </p>

        <h3 className="text-xl  mt-4 mb-1">Can I customize the playlists?</h3>
        <p>
          Currently, the playlists are generated automatically. To build and
          customize your playlists, try my other app,{" "}
          <Link
            href="https://decksio.vercel.app/"
            className="text-secondary hover:text-primary"
          >
            Decksio
          </Link>
          .
        </p>

        <h3 className="text-xl  mt-4 mb-1">Why isn't this thing working?</h3>
        <p>
          When there is increased traffic, Spotify will run into errors. If you
          are logged in, try logging out and logging back in.
        </p>

        <h3 className="text-xl  mt-4 mb-1">
          Can you make PacePlaylist for other music streaming serivces?
        </h3>
        <p>
          Not all music streaming services have accesible API's for your
          listening data, so for now it's just Spotify.
        </p>

        <h3 className="text-xl  mt-4 mb-1">How was PacePlaylist made?</h3>
        <p>
          PacePlaylist is an open source tool. Built with NextJS and styled with
          Tailwind.{" "}
          <Link href="/" className="text-secondary hover:text-primary">
            Check out the code here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
