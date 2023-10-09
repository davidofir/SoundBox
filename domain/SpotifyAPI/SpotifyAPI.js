import axios from 'axios';
import base64 from 'base-64';

const clientId = '78446884c91b415489c2e419606a8f75';
const clientSecret = '330da908bba34426ac4e05f220370032';

async function getAccessToken() {
  try {
    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = base64.encode(credentials);

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

    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
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
      const albumResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const album = albumResponse.data.album;
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