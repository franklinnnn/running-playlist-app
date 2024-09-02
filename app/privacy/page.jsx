import Link from "next/link";
import React from "react";

const PrivacyPage = () => {
  return (
    <div className="h-full md:min-h-[30rem] w-screen md:max-w-[36rem] px-2">
      <h1 className="text-4xl font-display uppercase italic text-center">
        Privacy Policy
      </h1>
      <br />
      <p>
        PacePlaylist was developed as an open source app using the Spotify API.
      </p>
      <br />
      <p>
        This app interacts with Spotify's Web API to provide features like
        generating playlists. Any data accessed is handled directly by Spotify
        and is not stored or collected by our app.
      </p>
      <br />
      <p>
        You can update your information and revoke app access through your
        Spotify account settings at any time. Manage your apps at{" "}
        <Link
          href="https://www.spotify.com/us/account/apps/?_ga=2.57194153.2059435232.1677244602-1044990631.1616788427"
          className="text-secondary hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          your apps page
        </Link>
        . Check out the{" "}
        <Link
          href="https://support.spotify.com/us/article/spotify-on-other-apps/"
          className="text-secondary hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spotify on other apps
        </Link>{" "}
        page.
      </p>
    </div>
  );
};

export default PrivacyPage;
