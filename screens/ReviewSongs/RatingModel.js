// RatingModel.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

class RatingModel {
  constructor(userId) {
    this.userId = userId;
    this.userRef = doc(db, "users", this.userId); // Reference to the user's document
  }

  async getUserReviews() {
    const docSnapshot = await getDoc(this.userRef);
    const userData = docSnapshot.data();
    return userData.reviews || [];
  }

  async addReview(reviewData) {
    await updateDoc(this.userRef, {
      reviews: arrayUnion(...reviewData),
    });
  }
}

export default RatingModel;