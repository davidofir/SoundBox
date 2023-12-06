import { authentication } from "../../firebase";
import { getUserReviewData } from "../FirebaseRepository/UserRepository";
import { getTopRatedReview } from "../../screens/Recommendations/RecommendAlgorithm";

const apiKey = "a7e2af1bb0cdcdf46e9208c765a2f2ca";

export class TrackModel {
    constructor() {
      this.tracks = [];
    }
  
    async fetchTopTracks() {
      const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=30`;
  
      const response = await fetch(url);
      const json = await response.json();
      this.tracks = json.tracks.track;
    }
  
    async fetchSong(searchInput) {
      if (searchInput != undefined && searchInput != null && searchInput != ""){
        
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchInput}&api_key=${apiKey}&format=json&limit=15`;
  
        const response = await fetch(url);
        const json = await response.json();
        this.tracks = json.results.trackmatches.track;
      }
      
    }
  
    async fetchTrackInfo(songTitle, artistTitle) {
      try {
        // Encode the parameters to handle special characters
        const encodedSongTitle = encodeURIComponent(songTitle);
        const encodedArtistTitle = encodeURIComponent(artistTitle);
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodedArtistTitle}&track=${encodedSongTitle}&format=json`;
    
        const response = await fetch(url);
        const data = await response.json();
        
        // Check if the expected data structure is present and has at least one tag
        if (data.track && data.track.toptags && Array.isArray(data.track.toptags.tag) && data.track.toptags.tag.length > 0) {
          
          return data;
        } else {
          // Handle the case where the genre information is not available
          return "Info not found";
        }
      } catch (error) {
        console.error("Error fetching genre:", error);
        return "Info not found";
      }
    }
    
  
    getTracks() {
      return this.tracks;
    }

    async fetchRecommendedSongs() {
      var currId = authentication.currentUser.uid;
      var reviews = await getUserReviewData(currId)

      const topReview = getTopRatedReview(reviews);
      if (topReview) {
        const encodedSongTitle = encodeURIComponent(topReview.songName);
        const encodedArtistTitle = encodeURIComponent(topReview.artistName);
        const apiKey = 'a7e2af1bb0cdcdf46e9208c765a2f2ca'; 
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodedArtistTitle}&track=${encodedSongTitle}&api_key=${apiKey}&format=json`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          if (data.similartracks && data.similartracks.track) {
            return data
          } else {
            console.error('Invalid API response format for song recommendations');
          }
        } catch (error) {
          console.error(error);
        }
        
      }
    }
  }