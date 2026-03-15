import os
from pathlib import Path
from dotenv import load_dotenv

# Load from backend/.env so it works regardless of CWD
load_dotenv(Path(__file__).resolve().parent / ".env")

GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_APP_KEY = os.getenv("NUTRITIONIX_APP_KEY")