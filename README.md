# 🎬 Movie Recommendation System

A smart movie recommendation system that combines:

- ✅ User preferences (genre, industry, last watched movie)  
- 🎭 Mood detection (via webcam using DeepFace)  
- ☁️ Weather-based suggestions (using OpenWeatherMap)  
- 🧠 Content-based filtering (TF-IDF + Cosine Similarity)

---

## 📦 Features

- 🎭 Mood Detection from webcam (using DeepFace)  
- ☁️ Weather-based genre mapping (e.g., Comedy for rainy days)  
- 🎥 Content-Based Recommendations based on the user's last watched movie  
- 🌍 Industry choice: Hollywood or Bollywood  
- 🖼️ Thumbnails & movie posters (via OMDb API)  
- 🌗 Light/Dark Mode toggle  
- 📱 Responsive UI with card-based layout and smooth animations

---

## 🧪 Tech Stack

| Frontend       | Backend (Node.js)        | Backend (Flask)        | Others             |
|----------------|--------------------------|-------------------------|--------------------|
| React.js       | Express.js               | Flask                   | MongoDB            |
| External CSS   | MongoDB for user data    | DeepFace (emotion AI)   | OMDb API           |
| React Webcam   | TF-IDF, Cosine Similarity| OpenWeatherMap API      | CSV datasets       |

---

## 📁 Folder Structure
  movie-recommendation-system/
  ├── client/                 # React frontend
  │   ├── components/         # Home.js, Content.js, Display.js, etc.
  │   └── App.js
  ├── node-backend/           # Node.js backend
  │   └── routes/             # /register, /login, /recommend, /user-preference
  ├── flask-backend/          # Flask backend
  │   └── app.py              # Handles mood & weather recommendations
  ├── datasets/
  │   ├── hollywood.csv       # MovieId, Title, Genres
  │   └── bollywood.csv       # movie_id, movie_name, genre, overview, etc.
  ├── README.md

