const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, unique: true },
  title: String,
  synopsis: String,
  episodes: Number,
  score: Number,
  image_url: String,
  genres: [String],
});

module.exports = mongoose.model('Anime', animeSchema);
