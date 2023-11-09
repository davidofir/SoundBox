import { doc, getDoc, updateDoc, collection, setDoc, arrayUnion } from "firebase/firestore";
import { authentication, db } from "../../firebase";

export const getListUserReviews = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    var usersReviews = docSnapshot.data().reviewIds
    

    const artistRef = doc(db, "artists", "Drake")
    const artistSnapshot = await getDoc(artistRef)
 
  };

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
        console.log("Error fetching review IDs");
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
