

const apiKey = "a7e2af1bb0cdcdf46e9208c765a2f2ca";

export class TrackModel {
    constructor() {
      this.tracks = [];
    }
  
    async fetchTopTracks() {
      const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`;
  
      const response = await fetch(url);
      const json = await response.json();
      this.tracks = json.tracks.track;
    }
  
    async fetchSong(searchInput) {
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchInput}&api_key=${apiKey}&format=json`;
  
      const response = await fetch(url);
      const json = await response.json();
      this.tracks = json.results.trackmatches.track;
    }
  
    async fetchGenre(songTitle, artistTitle) {
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artistTitle}&track=${songTitle}&format=json`;
  
        const response = await fetch(url);
        const data = await response.json();
  
        if (data && data.track && data.track.toptags && data.track.toptags.tag) {
          // Assuming the genre is in the first tag in the list
          const genre = data.track.toptags.tag[0].name;
          return genre;
        } else {
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