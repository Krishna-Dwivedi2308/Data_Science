from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DBNAME = os.getenv("MONGODB_DBNAME", "myapp")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI not set in env")

client = MongoClient(MONGODB_URI)
db = client[DBNAME]

# collections
users_col = db["users"]
