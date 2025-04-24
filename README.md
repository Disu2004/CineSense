🎬 Movie Recommendation System
A smart movie recommendation system that combines:
  User preferences (genre, industry, last watched movie)
  Mood detection (via webcam using DeepFace)
  Weather-based suggestions (using OpenWeatherMap)
  Content-based filtering (TF-IDF + Cosine Similarity)
📦 Features
  🎭 Mood Detection from webcam (using DeepFace)
  ☁️ Weather-based genre mapping (e.g., Comedy for rainy days)
  🎥 Content-Based Recommendations based on user's last watched movie
  🌍 Industry choice: Hollywood or Bollywood
  🖼️ Thumbnails & movie posters (via OMDb API)
  🌗 Light/Dark Mode toggle
  📱 Responsive UI with card-based layout and smooth animations

Frontend | Backend (Node.js) | Backend (Flask) | Others
React.js | Express.js | Flask | MongoDB
External CSS | MongoDB for user data | DeepFace (emotion AI) | OMDb API
React Webcam | TF-IDF, Cosine Similarity | OpenWeatherMap API | CSV datasets

📁 Folder Structure
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


🛠️ Setup Instructions
1. Clone the Repo
  **git clone https://github.com/your-username/movie-recommendation-system
  cd movie-recommendation-system**  
2. Start Flask Backend (Mood & Weather)
  **cd flask-backend
  pip install -r requirements.txt
  python app.py**
3. Start Node Backend (Content-Based)
  cd node-backend
  npm install
  node server.js
4. Start React Frontend
  cd client
  npm install
  npm start
🌐 Environment Variables
  Flask (flask-backend/.env)
  OPENWEATHER_API_KEY=your_openweather_api_key
  Node.js (node-backend/.env)
  MONGO_URI=mongodb+srv://your_mongo_uri
  OMDB_API_KEY=your_omdb_api_key
📸 UI Previews
  Home page with webcam preview
  Recommendations section (mood + weather + content)
  Toggle industry: Bollywood or Hollywood
  Mobile-friendly layout
🤖 AI & Logic
  Mood Detection: Captures webcam image and uses DeepFace to predict emotion
  Weather Fetching: Gets live weather via OpenWeatherMap
  Genre Mapping: Mood+Weather → Genre → Movie
  Content-Based: TF-IDF vectorization + Cosine similarity on movie genres & titles

🧑‍💻 Author
Developed with ❤️ by Dishant Upadhyay
© 2025 Dishant Upadhyay. All rights reserved.
