import pg from 'pg';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Anime = require('./models/anime');


const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Anime API!');
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to fetch and save anime from MyAnimeList
// app.get('/fetch-anime', async (req, res) => {
//   const malApiUrl = 'https://api.myanimelist.net/v2/anime?q=Naruto&limit=10'; // Example query
//   const headers = {
//     'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID,  // Your MAL API key
//   };

//   try {
//     const response = await fetch(malApiUrl, { headers });
//     if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

//     const data = await response.json();
//     const animeList = data.data.map(anime => ({
//       mal_id: anime.node.id,
//       title: anime.node.title,
//       synopsis: anime.node.synopsis,
//       episodes: anime.node.num_episodes,
//       score: anime.node.mean,
//       image_url: anime.node.main_picture.medium,
//       genres: anime.node.genres.map(genre => genre.name),
//     }));

//     // Save or update anime in the database
//     const savePromises = animeList.map(anime => 
//       Anime.findOneAndUpdate({ mal_id: anime.mal_id }, anime, { upsert: true })
//     );
//     await Promise.all(savePromises);

//     res.json({ message: 'Anime data saved/updated successfully', animeList });
//   } catch (error) {
//     console.error('Error fetching anime:', error);
//     res.status(500).send('Error fetching anime');
//   }
// });

app.get('/fetch-anime', async (req, res) => {
  const query = req.query.q || 'Naruto';
  const limit = req.query.limit || 10;
  const malApiUrl = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(query)}&limit=${limit}`;
  const headers = { 'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID };

  try {
    console.log('Request received for /fetch-anime');
    console.log('Query:', req.query); // Log incoming query parameters
    console.log('Constructed URL:', malApiUrl); // Log the API URL

    const response = await fetch(malApiUrl, { headers });

    console.log('Response Status:', response.status); // Log response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Text:', errorText); // Log API error
      return res.status(response.status).send(`Failed to fetch data: ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
