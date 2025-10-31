"use client";

import { loginWithSpotify } from "@/api";
import { useState } from "react";

export default function CTA() {
  return (
    <section
      id="cta"
      className="bg-gradient-to-b from-transparent to-green-500/10 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-bold sm:text-5xl">Ready to Create Magic?</h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl">
          Start creating AI-powered playlists today. Connect your Spotify account and describe your
          perfect playlist.
        </p>

        <button
          onClick={() => {
            loginWithSpotify();
          }}
          className="inline-flex transform items-center gap-2 rounded-full bg-green-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-600"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.573-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.72 12.84c.361.21.599.659.301 1.1zm.140-3.359c-3.9-2.32-10.661-2.582-15.021-1.424-.479.119-1.02-.12-1.14-.599-.12-.48.12-1.021.6-1.141 4.719-1.273 12.359-.961 16.56 1.62.361.21.599.659.301 1.1-.301.419-.841.599-1.3.401z" />
          </svg>
          Connect with Spotify
        </button>
      </div>
    </section>
  );
}
