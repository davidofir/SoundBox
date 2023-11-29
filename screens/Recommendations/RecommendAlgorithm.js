import { authentication } from "../../firebase";
import { getUserReviewData } from "../../domain/FirebaseRepository/UserRepository";

async function getUserReviews() {
    var currId = authentication.currentUser.uid;
    var reviews = await getUserReviewData(currId);
    return reviews;
}

async function getTopUserArtists(reviewArray) {
    const artistMap = new Map();
    const lambda = 0.5; // Might need to adjust after further testing and more reviews are made

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
}
