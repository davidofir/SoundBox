import axios from "axios";

export async function fetchArtistRecommendationFromAPI(artistData) {
  try {
    return await Promise.all(
      artistData.map(data => 
        axios.get(`https://alexsoundbox.pythonanywhere.com/recommend?artist_name=${encodeURIComponent(data.name)}&category=${encodeURIComponent(data.category)}`)
      )
    );
  } catch (error) {
    console.error('Fetch error from custom API:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
