import { authentication } from "../../firebase";
import { getUserReviewData, getFollowingUsers } from "../../domain/FirebaseRepository/UserRepository";

//get all of the logged users reviews
export async function getUserReviews() {
  var currId = authentication.currentUser.uid;
  var reviews = await getUserReviewData(currId);
  
  // Check if there are no reviews
  if (reviews.length === 0) {

      // Call NoReviewsFollowerRecommendations if there are no reviews
      return await NoReviewsFollowerRecommendations();
  }
  return reviews;
}


export function getTopRatedReview(reviews) {
    const maxRating = Math.max(...reviews.map(review => review.rating));
    const topRatedReviews = reviews.filter(review => review.rating === maxRating);
  
    // If there are multiple reviews with the highest rating, pick a random one.
    const randomReview = topRatedReviews[Math.floor(Math.random() * topRatedReviews.length)];
    
    return randomReview;
  } 

export async function getTopUserArtists(reviewArray) {
    if (reviewArray.length === 0 || reviewArray == undefined) {
      return []; // Return an empty array if there are no reviews
    }
  
    const artistMap = new Map();
  
    // Build the map with aggregate ratings and counts.
    reviewArray.forEach(review => {
      const { artistName, rating } = review;
      if (artistMap.has(artistName)) {
        const currentArtistData = artistMap.get(artistName);
        artistMap.set(artistName, {
          rating: currentArtistData.rating + rating,
          count: currentArtistData.count + 1,
        });
      } else {
        artistMap.set(artistName, {
          rating: rating,
          count: 1,
        });
      }
    });
  
    // Convert Map to Array and calculate the mean rating for each artist.
    const meanReviewList = Array.from(artistMap.entries()).map(([name, data]) => {
      const averageRating = data.rating / data.count;
      return {
        name: name,
        rating: averageRating,
      };
    });
  
    // Sort artists by rating in descending order
    meanReviewList.sort((a, b) => b.rating - a.rating);
  
    let results = [];
  
    // Determine if there are any top-rated artists
    const topArtists = meanReviewList.filter(artist => artist.rating >= 2.5);
  
    // Add the top-rated artist if available, otherwise add the lowest-rated artist
    results.push(topArtists.length > 0 ? 
                 { name: topArtists[0].name, category: 'top' } : 
                 { name: meanReviewList[meanReviewList.length - 1].name, category: 'bottom' });
  
    // Add the second artist based on availability and ratings
    if (meanReviewList.length > 1) {
      if (topArtists.length > 1) {
        // If there's a second top-rated artist, add them
        results.push({ name: topArtists[1].name, category: 'top' });
      } else {
        // Otherwise, add the second-lowest rated artist
        results.push({ name: meanReviewList[meanReviewList.length - 2].name, category: 'bottom' });
      }
    }
  
    return results;
  }

  export async function NoReviewsFollowerRecommendations() {
    const currentUserID = authentication.currentUser.uid;
    
    // Retrieve followers
    const followers = await getFollowingUsers(currentUserID);
    if (!followers.length) {
      return []; // Return empty if no followers
    }
    
    // Step 2: Aggregate reviews from followers
    let aggregatedReviews = [];
    for (const follower of followers) {

        const followerReviews = await getUserReviewData(follower);

        aggregatedReviews.push(...followerReviews);

    }
    // Step 3: Generate recommendations based on aggregated reviews

    return aggregatedReviews;
}


