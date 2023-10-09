import axios from 'axios';
import base64 from 'base-64'; // Import the base-64 library

// Define your Spotify API credentials
const clientId = '78446884c91b415489c2e419606a8f75';
const clientSecret = '330da908bba34426ac4e05f220370032';

// Create a function to obtain an access token
async function getAccessToken() {
  try {
    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = base64.encode(credentials); // Encode credentials to Base64

    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
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
      // Get an access token
      const accessToken = await getAccessToken();
  
      // Search for the track on Spotify
      console.log('Searching for song:', songName, 'by artist:', artistName);
  
      const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: `track:${songName} artist:${artistName}`,
          type: 'track',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const track = searchResponse.data.tracks.items[0];
  
      if (track) {
        // Extract the track ID
        const trackId = track.id;
  
        // Fetch the track's album information
        const albumResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const album = albumResponse.data.album;
  
        // Extract the cover art URLs (e.g., album.images[0].url)
        const coverArtUrl = album.images[0].url;
  
        return coverArtUrl;
      } else {
        throw new Error('Song not found on Spotify.');
      }
    } catch (error) {
      console.error('Error fetching cover art:', error);
      throw error;
    }
  }
  

export { searchAndFetchSongCoverArt };
