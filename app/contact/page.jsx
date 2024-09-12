import React from "react";
import Link from "next/link";

const ContactPage = () => {
  return (
    <div className="h-full md:min-h-[30rem] w-screen md:max-w-[36rem] px-2">
      <h1 className="text-4xl font-display uppercase text-center">Contact</h1>
      <br />
      <p>
        <a
          href="mailto:franklin.assa@gmail.com?subject=PacePlaylist"
          className="text-secondary hover:text-primary"
        >
          Send me an email
        </a>{" "}
        if you have questions about this app.
      </p>
      <br />
      <p>
        Follow me on{" "}
        <Link
          href="https://www.strava.com/athletes/41176856"
          className="text-secondary hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Strava
        </Link>{" "}
        to see my slow efforts. You can also check out other projects at{" "}
        <Link
          href="https://franklinnn.com"
          className="text-secondary hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          my website
        </Link>
        .
      </p>
    </div>
  );
};

export default ContactPage;
