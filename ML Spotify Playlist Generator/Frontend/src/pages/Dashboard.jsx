import React, { use, useEffect, useState } from "react";
import Header from "@/components/header";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { set_token_to_local } from "@/utils/handleTokens";
import { createInput, createPlaylist } from "@/api";

const Dashboard = () => {
  // extract token from search params and store to local storage
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const name = searchParams.get("name");
  if (token) {
    set_token_to_local(token, name);
  }
  const [query, setquery] = useState("");
  const [playlist_name, setplaylist_name] = useState("");
  const [loading, setloading] = useState(false);
  const [recommendations, setrecommendations] = useState([]);

  // make the axios api call to /create_input with this query

  // console.log(query);

  useEffect(() => {
    // Slight delay ensures <Toaster /> is mounted before calling toast
    const username = name ? name : "User";
    const timer = setTimeout(() => {
      toast(`Welcome! ${username}`, {
        description: "We are happy to Museify you  🎉",
      });
    }, 50); //50 ms delay so that useeffect does not fail
    return () => clearTimeout(timer);

    // FIX 2: Add the correct closing parenthesis and empty dependency array
  }, []);

  const handleSubmit = async () => {
    if (query.trim() === "") {
      toast.error("Please enter a prompt");
      return;
    }
    setloading(true);
    // seterror('')
    try {
      const data = await createInput(query);
      setrecommendations(data.track_ids);

      toast.success("Playlist created successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to create playlist.");
    } finally {
      setloading(false);
    }
  };

  const open_with_spotify = async () => {
    if (playlist_name.trim() === "") {
      toast.error("Please enter a name for the playlist");
      return;
    }
    setloading(true);
    // seterror('')
    try {
      const data = await createPlaylist(playlist_name);
      if (data.playlist_url) {
        window.open(data.playlist_url, "_blank");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to create playlist.");
    } finally {
      setloading(false);
      setrecommendations([]);
      setplaylist_name("");
      setquery("");
    }
  };
  return (
    // <div className="pt-10">
    //     <Header />
    //     <div className="my-15">
    //         <Textarea
    //             value={query}
    //             onChange={(e) => setquery(e.target.value)}
    //             placeholder="Type your prompt here..."
    //             className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl resize-none h-32  dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-400 "
    //         />

    //         <p className="text-muted-foreground text-sm">
    //             Directly describe the kind of playlist you want to create.
    //         </p>

    //         <p className="text-muted-foreground text-sm">
    //             Example: "A romantic playlist of songs with good music with medium loudness , medium instrumentalness and less danceability".
    //         </p>

    //         <Button
    //             onClick={() => handleSubmit()}
    //             disabled={loading}
    //         >Send message

    //         </Button>

    //         {recommendations.length!=0 ? <div>
    //             <Textarea
    //             value={playlist_name}
    //             onChange={(e) => setplaylist_name(e.target.value)}
    //             placeholder="Please enter the desired name of the Playlist..."
    //             className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl resize-none h-32  dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-400 "
    //         />
    //             <Button
    //             onClick={() => open_with_spotify()}
    //             disabled={loading}
    //         >Open with Spotify 🎵

    //         </Button>
    //         </div> : null}

    //     </div>

    // </div>
    <div className="flex min-h-screen flex-col items-center px-6 pt-10">
      <Header />

      <div className="mt-12 w-full max-w-3xl space-y-6">
        {/* Prompt Input */}
        <div className="space-y-3">
          <Textarea
            value={query}
            onChange={(e) => setquery(e.target.value)}
            placeholder="Describe your ideal playlist..."
            className="h-32 w-full resize-none rounded-2xl border border-gray-300 p-4 text-white placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />

          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p>💡 Tip: Describe the kind of playlist you want to create.</p>
            <p className="italic">
              Example: “A romantic playlist with medium loudness, moderate energy, and low
              danceability.”
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Playlist"}
          </Button>
        </div>

        {/* Playlist Name Input (after recommendations) */}
        {recommendations.length !== 0 && (
          <div className="animate-fadeIn mt-10 space-y-4">
            <Textarea
              value={playlist_name}
              onChange={(e) => setplaylist_name(e.target.value)}
              placeholder="Enter a name for your playlist..."
              className="h-20 w-full resize-none rounded-2xl border border-gray-300 p-4 text-white placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

            <div className="flex justify-end">
              <Button
                onClick={open_with_spotify}
                disabled={loading}
                className="rounded-xl bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Open with Spotify 🎵
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import Header from "@/components/header";
// import { toast } from "sonner";
// import api from "@/api"; // make sure your axios client is exported from src/api/index.js

// const Dashboard = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       toast("Welcome! User", {
//         description: "We are happy to Museify you 🎉",
//       });
//     }, 50);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleGeneratePlaylist = async () => {
//     if (!query.trim()) {
//       toast.error("Please describe the kind of playlist you want 🎵");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         "/create_input",
//         { query },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Playlist generated successfully!", {
//         description: `We found ${res.data.track_ids?.length || 0} songs 🎶`,
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to generate playlist", {
//         description: err.response?.data?.error || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>

//     </div>
//   );
// };

// export default Dashboard;
