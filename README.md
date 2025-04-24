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
movie-recommendation-system/<br/>
├── client/                 # React frontend<br/>
│   ├── components/         # Home.js, Content.js, Display.js, etc.<br/>
│   └── App.js<br/>
├── node-backend/           # Node.js backend<br/>
│   └── routes/             # /register, /login, /recommend, /user-preference<br/>
├── flask-backend/          # Flask backend<br/>
│   └── app.py              # Handles mood & weather recommendations<br/>
├── datasets/<br/>
│   ├── hollywood.csv       # MovieId, Title, Genres<br/>
│   └── bollywood.csv       # movie_id, movie_name, genre, overview, etc.<br/>
├── README.md<br/>



### 1. Clone the Repo
git clone https://github.com/your-username/movie-recommendation-system<br/>
cd movie-recommendation-system<br/>

2. Start Flask Backend (Mood & Weather)<br/>
cd server<br/>
pip install -r requirements.txt<br/>
python app.py<br/>

3. Start Node Backend (Content-Based)<br/>
cd server<br/>
npm install<br/>
node app.js<br/>

4. Start React Frontend<br/>
cd client<br/>
npm install<br/>
npm start<br/>

🧑‍💻 Author
Developed with ❤️ by Dishant Upadhyay
© 2025 Dishant Upadhyay. All rights reserved.
