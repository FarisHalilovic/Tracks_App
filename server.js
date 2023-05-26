const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 8080;

const CLIENT_ID = "3cb88028ca7840f3a55bd3f34897136a";
const CLIENT_SECRET = "eae0371b5c9a47218586ee553b7a8b78";

app.use(express.static(path.join(__dirname, "public")));

async function generateAccessToken() {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  };

  try {
    const response = await axios(authOptions);
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw error;
  }
}

async function fetchPopularTracks(artist) {
  const accessToken = await generateAccessToken();
  const searchOptions = {
    method: "get",
    url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artist
    )}&type=track&limit=50`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios(searchOptions);
    const tracks = response.data.tracks.items.slice(0, 10).map((track) => ({
      artist: track.artists[0].name,
      track: track.name,
      album_image_url: track.album.images[0].url,
      preview_url: track.preview_url,
    }));
    return tracks;
  } catch (error) {
    console.error("Failed to fetch popular tracks:", error);
    throw error;
  }
}

app.get("/tracks/:genre", async (req, res) => {
  const { genre } = req.params;
  const artists = require("./genres.json");
  const genreArtists = artists[genre];

  if (!genreArtists) {
    res.status(400).json({ error: "Invalid genre" });
    return;
  }

  const randomIndex = Math.floor(Math.random() * genreArtists.length);
  const artist = genreArtists[randomIndex];

  try {
    const popularTracks = await fetchPopularTracks(artist);
    res.json(popularTracks);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
