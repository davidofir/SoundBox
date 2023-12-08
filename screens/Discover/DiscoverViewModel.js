import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';


// ViewModel Class
class DiscoverViewModel {
    constructor() {
      this.trackModel = new TrackModel();
      this.searchInput = '';
      this.flatlistSwitch = 0;
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
  }