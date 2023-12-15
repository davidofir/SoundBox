import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';

// ViewModel Class
export class DiscoverViewModel {
    constructor() {
      this.trackModel = new TrackModel();
      this.searchInput = '';
      this.flatlistSwitch = 0;
      this.coverArts = {};
    }
  
    async fetchTopTracks() {
      await this.trackModel.fetchTopTracks();
      this.flatlistSwitch = 0;
    }
  
    async fetchSong() {
      await this.trackModel.fetchSong(this.searchInput);
      this.flatlistSwitch = 1;
    }
  
    setSearchInput(text) {
      this.searchInput = text;
    }
  
    setFlatlistSwitch(value) {
      this.flatlistSwitch = value;
    }
  
    getTracks() {
      return this.trackModel.getTracks();
    }

    async fetchCoverArt(track) {
      try {
        let artistName = track.artist.name;
        if (this.flatlistSwitch === 1 && track.artist) {
          artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
        }
  
        const trackIdentifier = `${track.name}_${artistName}`; // Unique identifier for each track
        const imageUrl = await searchAndFetchSongCoverArt(track.name, artistName);
        this.coverArts[trackIdentifier] = imageUrl;
      } catch (error) {
        console.error('Error fetching cover art:', error);
        const trackIdentifier = `${track.name}_${artistName}`;
        this.coverArts[trackIdentifier] = null; // Handle error case
      }
    }
  
  }