import { doc, getDoc, updateDoc, collection, setDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";

import { authentication, db } from "../../firebase";

const RatingModel = {

  async getUserReviews(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    return docSnapshot.data()?.reviews || [];
  },

  async getUserData(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    return userData.userName
  },

  async getUserImage(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    return userData.profilePicture ? userData.profilePicture : ""
  },

  async addReview(userId, reviewData) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      reviews: arrayUnion(reviewData),
    });
  },
}

export const getListUserReviews = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnapshot = await getDoc(userRef);
  var usersReviews = docSnapshot.data().reviewIds


  const artistRef = doc(db, "artists", "Drake")
  const artistSnapshot = await getDoc(artistRef)

};


export const storeReviewData = async (userId, finalArtistName, songName, rating, coverArtUrl, message) => {
  try {
    // Reference the 'reviews' collection
    const reviewsCollectionRef = collection(db, "reviews");

    // Query for an existing review with the same userId, finalArtistName, and songName
    const existingReviewQuery = query(
      reviewsCollectionRef,
      where("userId", "==", userId),
      where("artistName", "==", finalArtistName),
      where("songName", "==", songName)
    );

    const existingReviewQuerySnapshot = await getDocs(existingReviewQuery);

    if (existingReviewQuerySnapshot.size === 0) {
      // Generating a new document inside the 'reviews' collection
      // Firestore will automatically create a unique ID for this document
      const reviewRef = doc(collection(db, "reviews"));
      var reviewUUID = reviewRef.id

      const reviewData = {
        id: reviewRef.id, // Firestore generated unique ID
        userId: userId,
        username: await RatingModel.getUserData(userId),
        artistName: finalArtistName,
        songName: songName,
        creationTime: new Date().toISOString(),
        rating: rating,
        review: message,
        likes: [],
        albumImgURL: coverArtUrl,
        commentIds: [],
        profilePicture: await RatingModel.getUserImage(userId),
      };

      // Save the review data to the new document in the 'reviews' collection.
      await setDoc(reviewRef, reviewData);

      // Reference the 'artists' collection and the specific artist's document.
      const artistDocRef = doc(db, "artists", finalArtistName);

      // Reference the specific song's document.
      const songDocRef = doc(artistDocRef, "songs", songName);

      // Check if the song already exists.
      const songDocSnapshot = await getDoc(songDocRef);
      if (!songDocSnapshot.exists()) {
        // If the song does not exist, create a new song document with the first review ID.
        await setDoc(songDocRef, {
          reviewIds: [reviewUUID] // Use the ID from the reviewRef.
        });
      } else {
        // If the song exists, add the review ID to the song's document.
        await updateDoc(songDocRef, {
          reviewIds: arrayUnion(reviewRef.id)
        });
      }

      // update the user's document with the new review ID.
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        reviewIds: arrayUnion(reviewRef.id)
      });
      return true


    } else {
      // If an existing review is found, update it
      const existingReviewId = existingReviewQuerySnapshot.docs[0].id;
      const existingReviewRef = doc(reviewsCollectionRef, existingReviewId);

      // Update the existing review with the new data
      await updateDoc(existingReviewRef, {
        rating: rating,
        review: message,
      });

      // Return the ID of the updated review
      return existingReviewId;
    }
  } catch (error) {
    console.error("Error storing/updating review:", error);
    return null;
  }
}

export const getSongReviewIDs = async (songName, artistName) => {
  let reviewIds = []; // Initialize an array to hold the review IDs

  try {
    // Reference the specific song document within the 'songs' subcollection of the artist
    const songRef = doc(db, "artists", artistName, "songs", songName);

    // Get a snapshot of the song document
    const songSnapshot = await getDoc(songRef);

    if (songSnapshot.exists()) {
      // If the song document exists, retrieve the review IDs
      reviewIds = songSnapshot.data().reviewIds || [];
      return reviewIds;
    } else {
      return reviewIds;
    }

  } catch (error) {
    console.log("Error fetching review IDs");
    return reviewIds;
  }
}

export const getSongReviews = async (songName, artistName) => {
  try {
    const reviewIds = await getSongReviewIDs(songName, artistName); // Fetch the review IDs for the song
    const reviews = [];

    for (const id of reviewIds) {
      // Iterate through the review IDs
      const reviewRef = doc(db, "reviews", id); // Reference to the review document in the "reviews" collection
      const reviewSnap = await getDoc(reviewRef); // Get the document snapshot

      if (reviewSnap.exists()) {
        reviews.push(reviewSnap.data()); // If the review document exists, add its data to the reviews array
      } else {
        console.log("Error fetching reviews:");
        return reviews;
      }
    }
    return reviews; // Return the array of review data
  } catch (error) {
    console.log("Error fetching reviews:");
    return reviews;
  }
}
