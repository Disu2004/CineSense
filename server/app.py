from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from deepface import DeepFace
import pandas as pd
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load datasets
df_hollywood = pd.read_csv("./datasets/hollywood.csv")
df_bollywood = pd.read_csv("./datasets/bollywood.csv")

# Mood-to-genre mapping
mood_to_genre = {
    "happy": ["Comedy", "Adventure"],            # Maintain positivity with light and fun content
    "sad": ["Comedy", "Family"],                 # Cheer up with feel-good, uplifting genres
    "angry": ["Comedy", "Romance"],              # Calm down with soothing or humorous content
    "surprise": ["Mystery", "Adventure"],        # Match excitement with engaging and unpredictable content
    "fear": ["Comedy", "Fantasy","Action"],      # Reduce anxiety with safe, whimsical genres
    "neutral": ["Drama", "Documentary"],         # Engage lightly with thoughtful or informative genres
    "disgust": ["Romance", "Inspiration"],       # Balance negativity with heartfelt, human stories
}


# Weather-to-genre mapping
weather_to_genre = {
    "Clear": ["Adventure", "Comedy", "Sci-Fi"],
    "Rain": ["Drama", "Romance", "Mystery"],
    "Drizzle": ["Drama", "Romance", "Mystery"],
    "Snow": ["Animation", "Fantasy", "Family"],
    "Fog": ["Thriller", "Horror", "Mystery"],
    "Mist": ["Thriller", "Horror", "Mystery"],
    "Thunderstorm": ["Action", "Horror", "Sci-Fi"],
    "Wind": ["Fantasy", "Action", "Western"],
    "Clouds": ["Drama", "Mystery", "Documentary"]
}

def analyze_emotion(image):
    try:
        img_data = base64.b64decode(image)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)

        if isinstance(result, list) and len(result) > 0:
            return result[0]['dominant_emotion']
        elif isinstance(result, dict):
            return result['dominant_emotion']
        else:
            return "neutral"
    except Exception as e:
        print("Emotion analysis error:", e)
        traceback.print_exc()
        return "neutral"

def filter_movies(df, genres, source):
    # Auto-detect the genre column
    if "genres" in df.columns:
        genre_col = "genres"
    elif "genre" in df.columns:
        genre_col = "genre"
    else:
        print("Error: No genre column found in dataset.")
        return pd.DataFrame()

    # Auto-detect the title column
    if "title" in df.columns:
        title_col = "title"
    elif "movie_name" in df.columns:
        title_col = "movie_name"
    else:
        print("Error: No title column found in dataset.")
        return pd.DataFrame()

    def match_genre(x):
        if pd.isna(x):
            return False
        x = str(x).replace("|", ",")
        return any(g.lower() in x.lower() for g in genres)

    filtered = df[df[genre_col].apply(match_genre)]

    # Columns to return
    expected_cols = [title_col, genre_col]
    for optional_col in ["movieId", "movie_id", "imdbId", "tmdbId", "year", "overview", "director", "cast", "Languages"]:
        if optional_col in df.columns:
            expected_cols.append(optional_col)

    return filtered[expected_cols].fillna("N/A")



@app.route("/detect_mood", methods=["POST", "OPTIONS"])
def detect_mood():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight success"}), 200

    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        image = data.get("image")
        movie_source = data.get("movie_source", "hollywood").lower()
        weather = data.get("weather", "Clear").strip().capitalize()

        print(f"Movie source: {movie_source}")
        print(f"Weather: {weather}")

        df = df_bollywood if movie_source == "bollywood" else df_hollywood

        mood = analyze_emotion(image).lower()
        print("Detected mood:", mood)

        mood_genres = mood_to_genre.get(mood, [])
        weather_genres = weather_to_genre.get(weather, [])

        print("Genres from mood:", mood_genres)
        print("Genres from weather:", weather_genres)

        mood_movies = filter_movies(df, mood_genres, movie_source)
        weather_movies = filter_movies(df, weather_genres, movie_source)
        print(mood_movies)
        return jsonify({
            "mood": mood,
            "weather_movies": weather_movies.to_dict(orient='records'),
            "mood_movies": mood_movies.to_dict(orient='records')
        })

    except Exception as e:
        print("Error in /detect_mood endpoint:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Mood detection failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)
