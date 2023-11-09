

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
  
    async fetchGenre(songTitle, artistTitle) {
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artistTitle}&track=${songTitle}&format=json`;
    
        const response = await fetch(url);
        const data = await response.json();
    
        // Check if the expected data structure is present and has at least one tag
        if (data.track && data.track.toptags && Array.isArray(data.track.toptags.tag) && data.track.toptags.tag.length > 0) {
          const genre = data.track.toptags.tag[0].name;
          return genre;
        } else {
          // Handle the case where the genre information is not available
          return "Genre not found";
        }
      } catch (error) {
        console.error("Error fetching genre:", error);
        return "Error fetching genre";
      }
    }
  
    getTracks() {
      return this.tracks;
    }
  }