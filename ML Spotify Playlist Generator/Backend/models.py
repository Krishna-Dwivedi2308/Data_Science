# models.py
from pydantic import BaseModel


# pydantic model for user feature that the LLM will generate  - LLM response will be validated with this
class UserFeatures(BaseModel):
    popularity: float
    acousticness: float
    danceability: float
    duration_ms: float
    energy: float
    instrumentalness: float
    liveness: float
    loudness: float
    speechiness: float
    tempo: float
    valence: float
    key: float
    mode: float
    time_signature: float
