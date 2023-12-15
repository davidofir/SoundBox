import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';
import { getSongReviews } from '../ReviewSongs/ReviewStorage';

export async function getRecommendedSongs() {
  const trackModel = new TrackModel();
  try {
    const songRecs = await trackModel.fetchRecommendedSongs();
    if (!songRecs || !songRecs.similartracks || !songRecs.similartracks.track || songRecs.similartracks.track.length === 0) {
      return [];
    }

    // Fetch cover art and reviews for the top six songs
    let songsWithCoverArt = await Promise.all(
      songRecs.similartracks.track.slice(0, 6).map(async (song) => {
        const coverArtUrl = await searchAndFetchSongCoverArt(song.name, song.artist.name);
        const reviews = await fetchReviews(song.name, song.artist.name);
        let averageRating = 0;
        if (reviews.length > 0) {
          averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        }
        return { ...song, coverArtUrl, reviews, averageRating };
      })
    );

    // Sort songs with reviews to the front and by average rating
    songsWithCoverArt.sort((a, b) => {
      if (b.reviews.length === 0 && a.reviews.length === 0) return 0; // Both have no reviews
      if (b.reviews.length === 0) return -1; // A has reviews, B does not
      if (a.reviews.length === 0) return 1;  // B has reviews, A does not
      return b.averageRating - a.averageRating; // Both have reviews, sort by average rating
    });

    const restOfTheSongs = songRecs.similartracks.track.slice(6).map(song => ({ ...song, coverArtUrl: null }));

    return [...songsWithCoverArt, ...restOfTheSongs];
  } catch (error) {
    console.error('Error fetching recommended songs:', error);
    return null;
  }
}

async function fetchReviews(songName, artistName){
  try {
    const fetchedReviews = await getSongReviews(songName, artistName);
    const sortedReviews = fetchedReviews.sort((a, b) => b.likes.length - a.likes.length);
    return sortedReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};



