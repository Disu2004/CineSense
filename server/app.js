const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cosineSimilarity = require('cosine-similarity');

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===
const uri = "Your_Mongodb_Url";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// === Counter Schema for Auto-Incrementing userId ===
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
}

// === User Schema ===
const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  mobileno: { type: String, unique: true },
  location: String,
});
const User = mongoose.model('User', UserSchema);

// === Preference Schema ===
const PreferenceSchema = new mongoose.Schema({
  userId: Number,
  industry: String,
  genres: [String],
  lastMovie: String,
});
const Preference = mongoose.model('Preference', PreferenceSchema);

// === Register Route ===
app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, mobileno, location } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobileno }] });
     if (existingUser) {
      const conflictField = existingUser.email === email ? "Email" : "Mobile number";
      return res.status(400).json({ message: `${conflictField} already registered` });
    }
    const userId = await getNextSequence("userId");

    const newUser = new User({ userId, firstname, lastname, email, password, mobileno, location });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful', userId });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// === Login Route ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      redirect: "/",
      userId: user.userId
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === Save User Preferences ===
app.post('/user-preference', async (req, res) => {
  const { userId, industry, genres, lastMovie } = req.body;

  try {
    const preference = new Preference({ userId, industry, genres, lastMovie });
    await preference.save();
    res.status(201).json({ message: "Preferences saved" });
  } catch (err) {
    console.error("❌ Error saving preference:", err);
    res.status(500).json({ message: "Error saving preference" });
  }
});

// === Get User Info ===
app.get('/user-preference/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: parseInt(req.params.userId) });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobileno: user.mobileno,
      location: user.location,
    });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// === Get User Preferences ===
app.get('/preference/:userId', async (req, res) => {
  try {
    const preference = await Preference.findOne({ userId: parseInt(req.params.userId) });
    if (!preference) return res.status(404).json({ error: "Preference not found" });
    res.json(preference);
  } catch (err) {
    console.error("❌ Error fetching preference:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// === Industry Source (Bollywood/Hollywood) ===
app.get('/source/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const preference = await Preference.findOne({ userId });

    if (!preference) return res.status(404).send('User preference not found');

    const isBollywood = preference.industry.toLowerCase() === 'bollywood';
    res.send(isBollywood ? 'bollywood' : 'hollywood');
  } catch (error) {
    console.error('❌ Error in /source route:', error);
    res.status(500).send('Internal server error');
  }
});

// === Recommendation Route ===
app.get('/recommend/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preference = await Preference.findOne({ userId: parseInt(userId) });

    if (!preference) return res.status(404).json({ message: 'Preferences not found' });

    const { industry, genres } = preference;
    const isBollywood = industry.toLowerCase() === 'bollywood';
    const filePath = path.join(__dirname, isBollywood ? './datasets/bollywood.csv' : './datasets/hollywood.csv');

    const movies = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (movies.length >= 30000) return;

        const title = (data.movie_name || data.title)?.trim();
        const genre = data.genre?.trim() || data.genres?.trim();
        const imdbID = data.movie_id?.trim() || data.imdbId?.trim();

        if (title && genre && imdbID) {
          const delimiter = isBollywood ? ',' : '|';
          movies.push({
            title,
            genres: genre.split(delimiter).map(g => g.trim()),
            imdbID
          });
        }
      })
      .on('end', () => {
        if (!movies.length) {
          return res.status(500).json({ message: "CSV Parsing failed or empty" });
        }

        const allGenres = new Set();
        movies.forEach(movie => movie.genres.forEach(genre => allGenres.add(genre.toLowerCase())));
        const genreTerms = Array.from(allGenres);

        const userVector = genreTerms.map(term =>
          genres.map(g => g.toLowerCase()).includes(term) ? 1 : 0
        );

        let recommendations = movies.map(movie => {
          const docVector = genreTerms.map(term =>
            movie.genres.map(g => g.toLowerCase()).includes(term) ? 1 : 0
          );
          return {
            ...movie,
            score: cosineSimilarity(userVector, docVector)
          };
        }).filter(m => m.score > 0.1);

        if (recommendations.length === 0) {
          return res.status(200).json({
            recommended: [],
            reason: "No matching genres found with sufficient similarity"
          });
        }

        recommendations.sort(() => 0.5 - Math.random());
        recommendations = recommendations.slice(0, 30);

        return res.status(200).json({
          recommended: recommendations,
          reason: "Content-based filtering with shuffle"
        });
      });

  } catch (err) {
    console.error("❌ Recommendation error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// === Update User Info ===
app.put('/update-user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === Update Preferences ===
app.put('/update-preference/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const updatedPreference = await Preference.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );
    if (!updatedPreference) return res.status(404).json({ message: "Preference not found" });
    res.json({ message: "Preference updated successfully", preference: updatedPreference });
  } catch (err) {
    console.error("❌ Error updating preference:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === Start Server ===
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
