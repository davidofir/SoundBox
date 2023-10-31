import axios from 'axios';
import base64 from 'base-64';
import axiosRateLimit from 'axios-rate-limit';


const clientId = '78446884c91b415489c2e419606a8f75';
const clientSecret = '330da908bba34426ac4e05f220370032';
const defaultImageUrl = require("../../assets/defaultSongImage.png");

// Create an instance of Axios with rate limiting
const axiosInstance = axiosRateLimit(axios.create(), {
  maxRequests: 10, // Set the maximum number of requests per second
  perMilliseconds: 10, // Set the rate limit interval in milliseconds (1 request per second in this example)
});

// Define the getAccessToken function here
async function getAccessToken() {
  try {
    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = base64.encode(credentials);

    const response = await axiosInstance.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('Access token not found in response.');
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

async function searchAndFetchSongCoverArt(songName, artistName) {
  try {
    const accessToken = await getAccessToken();
    let searchQuery;

    // Check if either songName or artistName contains quotes
    if (songName.includes('"') || artistName.includes('"') || songName.includes("'") || artistName.includes("'")) {
      // Use the modified approach for songs with quotes
      searchQuery = encodeURIComponent(`track:${songName} artist:${artistName}`);
    } else {
      // Use the regular approach
      searchQuery = `track:${songName} artist:${artistName}`;
    }

    const searchResponse = await axiosInstance.get('https://api.spotify.com/v1/search', {
      params: {
        q: searchQuery,
        type: 'track',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const track = searchResponse.data.tracks.items[0];

    if (track) {
      const trackId = track.id;
      const albumResponse = await axiosInstance.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const album = albumResponse.data.album;
      const coverArtUrl = album.images[0].url + `?timestamp=${Date.now()}`;

      return coverArtUrl;
    } else {
      // Return the default image URL (local asset) if no cover art is found
      return defaultImageUrl;
    }
  } catch (error) {
    console.error('Error fetching cover art:', error);
    // Return the default image URL (local asset) on error as well
    return defaultImageUrl;
  }
}

async function searchAndFetchArtistImage(){
  
}

export { searchAndFetchSongCoverArt };
