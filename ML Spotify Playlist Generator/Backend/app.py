from openai import OpenAI
import json
import os
import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, Request, Depends, HTTPException
from typing import Dict
from fastapi.responses import RedirectResponse
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv

load_dotenv()
from db import users_col
from auth import create_jwt_for_user, upsert_user_from_spotify, get_current_user
from spotify_utils import sp_oauth
from models import UserFeatures
from fastapi.middleware.cors import CORSMiddleware

# initialize fastapi and openai
app = FastAPI()
client = OpenAI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # your frontend
        "http://127.0.0.1:5173",
    ],  # or specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load saved files
df = pd.read_csv("songs_with_clusters.csv")
scaler = joblib.load("scaler_model.pkl")
kmeans = joblib.load("K_means_model.pkl")

# numeric features used for training
features = [
    "popularity",
    "acousticness",
    "danceability",
    "duration_ms",
    "energy",
    "instrumentalness",
    "liveness",
    "loudness",
    "speechiness",
    "tempo",
    "valence",
    "key",
    "mode",
    "time_signature",
]

# Scale the data for correct clustering the way it was trained
X_scaled = scaler.transform(df[features])


# recommend 10 songs based on the user features, that evevtually the LLM will generate
def recommend_songs(user_features, top_n=10):
    """
    user_features: dict like {'energy':0.8, 'valence':0.7, 'danceability':0.6, ...}
    """
    # Convert to DataFrame
    user_df = pd.DataFrame([user_features])

    # Scale the input
    user_scaled = scaler.transform(user_df[features])

    # Predict the cluster
    cluster_id = kmeans.predict(user_scaled)[0]

    # Filter songs in that cluster
    cluster_songs = df[df["cluster"] == cluster_id]
    cluster_scaled = X_scaled[df["cluster"] == cluster_id]

    # Compute similarity between user input and all songs in this cluster
    sims = cosine_similarity(user_scaled, cluster_scaled)[0]
    cluster_songs = cluster_songs.assign(similarity=sims)

    # Sort by similarity
    top_songs = cluster_songs.sort_values("similarity", ascending=False).head(top_n)

    return top_songs[["track_id", "track_name", "artist_name", "similarity"]]


"""
user_features = {
    "popularity": 50,          
    "acousticness": 0.2,
    "danceability": 0.7,
    "duration_ms": 180000,     
    "energy": 0.9,
    "instrumentalness": 0.0,   
    "liveness": 0.3,
    "loudness": -5.0,          
    "speechiness": 0.1,
    "tempo": 120,              
    "valence": 0.8,            
    "key": 5,                  
    "mode": 1,                 
    "time_signature": 4        
}
"""
# OAuth scope for creating playlists
scope = "playlist-modify-public playlist-modify-private"

# sp_oauth = SpotifyOAuth(
#     client_id=os.getenv("SPOTIPY_CLIENT_ID"),
#     client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
#     redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
#     scope="playlist-modify-public playlist-modify-private",
#     cache_path=None
# )


# the route that will prompt the LLM to create a input for the ML model based on the prompt by the user and then call the recommend_songs function
@app.post("/create_input")
def create_input(query: str, current: dict = Depends(get_current_user)):
    """
    Converts a natural language music preference string into a structured UserFeatures object.
    Example input: "I want energetic dance music with high tempo and low acousticness."
    """
    print(query)
    current_user = current["user"]
    prompt1 = f"""
    You are a music feature generator for a Spotify recommendation model.
    Convert the following user request into a JSON object matching this structure:
    {{
        "popularity": float (0-100),
        "acousticness": float (0-1),
        "danceability": float (0-1),
        "duration_ms": float (around 120000–300000 typical),
        "energy": float (0-1),
        "instrumentalness": float (0-1),
        "liveness": float (0-1),
        "loudness": float (around -60 to 0),
        "speechiness": float (0-1),
        "tempo": float (around 60–200 BPM),
        "valence": float (0-1),
        "key": integer (0–11),
        "mode": integer (0 or 1),
        "time_signature": integer (usually 3 or 4)
    }}

    The values should be reasonable and consistent with the user’s musical intent.
    Return only valid JSON — no explanations.

    User query: "{query}"
    the output should not contain anything else , no comments or markdown , nothing .
    do not enclose it in backticks .
    just simple json output. key-value pairs inside curly brackets.
    """
    prompt = f"""
You are an expert music feature generator for a Spotify recommendation model.

Your task is to convert a natural language description of a desired playlist or song into a structured JSON object of numerical audio features.

Output JSON should exactly match this structure:
{{
    "popularity": float (0–100),
    "acousticness": float (0–1),
    "danceability": float (0–1),
    "duration_ms": float (typically 120000–300000),
    "energy": float (0–1),
    "instrumentalness": float (0–1),
    "liveness": float (0–1),
    "loudness": float (around -60 to 0),
    "speechiness": float (0–1),
    "tempo": float (around 60–200 BPM),
    "valence": float (0–1),
    "key": integer (0–11),
    "mode": integer (0 or 1),
    "time_signature": integer (usually 3 or 4)
}}

Each value must be numerically realistic and consistent with the user’s musical intent.

Interpretations of Common Descriptive Terms:

"Soothing", "Calm", "Relaxing" → low energy (0.2–0.4), low loudness (-40 to -20), high acousticness (0.6–1.0), low tempo (60–90 BPM), low danceability, high valence (0.6–0.8).
"Energetic", "Upbeat", "High tempo" → high energy (0.8–1.0), high loudness (-8 to 0), high tempo (120–180 BPM), high danceability.
"Sad", "Melancholic" → low valence (0.1–0.3), moderate energy (0.3–0.5), low tempo (60–100 BPM), often minor mode (mode = 0).
"Happy", "Cheerful", "Positive vibes" → high valence (0.7–1.0), high energy (0.6–0.9), tempo (100–160 BPM), mode = 1.
"Romantic" → moderate energy (0.4–0.6), moderate acousticness (0.4–0.7), valence (0.6–0.8), tempo (70–110 BPM), smooth loudness (-20 to -10).
"Chill", "Lo-fi", "Study music" → low energy (0.3–0.5), low loudness (-40 to -20), moderate acousticness (0.5–0.8), low speechiness.
"Party", "Dance", "Club" → very high energy (0.8–1.0), high danceability (0.8–1.0), high tempo (120–160 BPM), loudness (-6 to 0), valence (0.6–1.0).
"Instrumental" → high instrumentalness (0.7–1.0), low speechiness (0–0.2).
"Live" or "Concert-like" → higher liveness (0.6–1.0).
"Acoustic" → high acousticness (0.8–1.0), low energy (0.3–0.5), low loudness.
"Electronic", "EDM" → low acousticness (0–0.2), high energy (0.8–1.0), high loudness, tempo 120–160 BPM.

Example Conversions:

Example 1
User query: "I want a soothing acoustic playlist to relax at night."
Expected style:
{{
    "popularity": 60,
    "acousticness": 0.85,
    "danceability": 0.3,
    "duration_ms": 240000,
    "energy": 0.3,
    "instrumentalness": 0.4,
    "liveness": 0.2,
    "loudness": -35,
    "speechiness": 0.1,
    "tempo": 75,
    "valence": 0.7,
    "key": 0,
    "mode": 1,
    "time_signature": 4
}}

Example 2
User query: "An energetic dance playlist for a workout."
Expected style:
{{
    "popularity": 80,
    "acousticness": 0.1,
    "danceability": 0.9,
    "duration_ms": 210000,
    "energy": 0.95,
    "instrumentalness": 0.2,
    "liveness": 0.4,
    "loudness": -5,
    "speechiness": 0.2,
    "tempo": 145,
    "valence": 0.8,
    "key": 9,
    "mode": 1,
    "time_signature": 4
}}

Return only valid JSON — no explanations, no comments, and no markdown formatting.
Do not enclose in backticks.

User query: "{query}"
"""

    # print(prompt)
    try:
        response = client.responses.create(
            model="gpt-4o",  #
            input=prompt,
        )

        print(response.output_text)
        raw_output = response.output_text

        # Parse JSON
        features = json.loads(raw_output)

        # Validate against Pydantic model
        user_features = UserFeatures(**features)

    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON from model output.", "raw": raw_output}

    except Exception as e:
        return {"error": str(e)}

    # Convert Pydantic model to dict
    user_features_dict = user_features.dict()

    # Get recommendations from your ML function
    recs = recommend_songs(user_features_dict)
    print(type(recs))
    # Extract only track IDs and convert it to list and save to DB
    if isinstance(recs, pd.DataFrame):
        track_ids = recs["track_id"].tolist()
    elif isinstance(recs, dict):
        # If dict has "track_id" as keys
        if "track_id" in recs:
            track_ids = list(recs["track_id"].values())
        else:
            # fallback: if dict keyed by row index
            track_ids = [v["track_id"] for v in recs.values()]
    else:
        raise ValueError("Unexpected recommendations format")

    # Save recommendations to DB (overwrite previous)
    users_col.update_one(
        {"_id": current_user["_id"]}, {"$set": {"last_recommendations": track_ids}}
    )

    return {"message": "Recommendations generated!", "track_ids": track_ids}


@app.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)


# dependency to get current user from Authorization: Bearer <token>


@app.get("/callback")
def callback(code: str = None):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    # get token (this will contain access_token, refresh_token, expires_at)
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info.get("access_token")
    # refresh_token = token_info.get("refresh_token")

    # create a temp spotify client to fetch user profile
    sp = Spotify(auth=access_token)
    spotify_user = sp.current_user()
    user_name = spotify_user.get("display_name")
    # upsert user into DB and store tokens
    user_doc = upsert_user_from_spotify(spotify_user, token_info)

    # create JWT for frontend to use
    jwt_token = create_jwt_for_user(user_doc)

    # Returnimg the JWT and some user info or redirect to front-end with token
    # return {"message": "Login successful", "token": jwt_token, "user": {
    #     "spotify_id": user_doc.get("spotify_id"),
    #     "display_name": user_doc.get("display_name"),
    #     "email": user_doc.get("email")
    # }}
    frontend_url = os.getenv(
        "FRONTEND_URL", "http://localhost:5173"
    )  # fallback for dev
    redirect_url = f"{frontend_url}/dashboard?token={jwt_token}&name={user_name}"

    return RedirectResponse(url=redirect_url)


# example protected endpoint: create playlist for logged in user
@app.post("/create_playlist_protected")
def create_playlist_protected(
    name_of_playlist: str, current: dict = Depends(get_current_user)
):
    sp = current["spotify"]
    current_user = current["user"]
    user_id = current_user["spotify_id"]

    #  Fetch last recommendations from DB
    user_doc = users_col.find_one({"_id": current_user["_id"]})
    track_ids = user_doc.get("last_recommendations", [])

    if not track_ids:
        raise HTTPException(
            status_code=400, detail="No recommendations found for this user."
        )

    playlist = sp.user_playlist_create(
        user=user_id,
        name=f"{name_of_playlist} by Museify",
        public=False,
        description="Museify generated Playlist🎧",
    )

    track_uris = [f"spotify:track:{tid}" for tid in track_ids]
    sp.playlist_add_items(playlist_id=playlist["id"], items=track_uris)

    return {
        "message": "Playlist created successfully.",
        "playlist_url": playlist["external_urls"]["spotify"],
    }
