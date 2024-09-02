import Head from "next/head";
import React from "react";

const SEO = ({ pageTitle, pageDescription }) => {
  return (
    <Head>
      <title>RunBeat - Custom Running Playlists Tailored to Your Pace</title>
      <meta
        name="description"
        content="Generate personalized playlists that match your running tempo. Choose your pace and let the music drive your run."
      />
      <meta
        name="keywords"
        content="running playlists, tempo music, workout music, running apps, fitness playlists"
      />
      <meta name="author" content="Your Name" />

      {/* Open Graph tags for social media */}
      <meta property="og:title" content="RunBeat - Custom Running Playlists" />
      <meta
        property="og:description"
        content="Generate playlists that match your running tempo."
      />
      <meta property="og:image" content="/images/your-image.png" />
      <meta property="og:url" content="https://www.yourapp.com" />
      <meta property="og:type" content="website" />

      {/* Twitter Cards for Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="RunBeat - Custom Running Playlists" />
      <meta
        name="twitter:description"
        content="Generate playlists that match your running tempo."
      />
      <meta name="twitter:image" content="/images/your-image.png" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://www.yourapp.com" />
    </Head>
  );
};

export default SEO;
