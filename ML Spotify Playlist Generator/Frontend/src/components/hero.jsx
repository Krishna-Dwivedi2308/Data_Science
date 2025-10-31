"use client";

import { loginWithSpotify } from "@/api";
import { useState } from "react";

export default function Hero() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="text-sm font-medium text-green-400">AI-Powered Playlist Generation</span>
        </div>

        <h1 className="mb-6 text-5xl leading-tight font-bold text-balance sm:text-6xl lg:text-7xl">
          Create Perfect Playlists with AI
        </h1>

        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl text-balance">
          Describe your mood, vibe, or any theme. Museify uses AI to generate 10 perfectly curated
          songs and adds them directly to your Spotify account.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => {
              loginWithSpotify();
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex transform items-center gap-2 rounded-full bg-green-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-600"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.573-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.72 12.84c.361.21.599.659.301 1.1zm.140-3.359c-3.9-2.32-10.661-2.582-15.021-1.424-.479.119-1.02-.12-1.14-.599-.12-.48.12-1.021.6-1.141 4.719-1.273 12.359-.961 16.56 1.62.361.21.599.659.301 1.1-.301.419-.841.599-1.3.401z" />
            </svg>
            Connect with Spotify
          </button>

          <button className="border-border hover:border-foreground text-foreground rounded-full border px-8 py-4 font-semibold transition-all duration-300">
            Watch Demo
          </button>
        </div>

        {/* Hero visual */}
        <div className="relative mt-20">
          <div className="rounded-2xl bg-gradient-to-b from-green-500/20 to-transparent p-1">
            <div className="bg-card border-border rounded-2xl border p-8">
              <div className="space-y-4">
                <div className="bg-muted h-4 w-3/4 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-muted h-24 rounded-lg"></div>
                  <div className="bg-muted h-24 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
