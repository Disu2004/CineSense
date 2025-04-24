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
<pre><code>## 📁 Folder Structure <code>movie-recommendation-system/</code> ├── <strong>client/</strong>                   # React frontend │   ├── <strong>components/</strong>          # Home.js, Content.js, Display.js, etc. │   └── <strong>App.js</strong> ├── <strong>node-backend/</strong>             # Node.js backend │   └── <strong>routes/</strong>              # /register, /login, /recommend, /user-preference ├── <strong>flask-backend/</strong>            # Flask backend │   └── <strong>app.py</strong>               # Handles mood & weather recommendations ├── <strong>datasets/</strong> │   ├── <strong>hollywood.csv</strong>        # MovieId, Title, Genres │   └── <strong>bollywood.csv</strong>        # movie_id, movie_name, genre, overview, etc. ├── <strong>README.md</strong> </code></pre>
