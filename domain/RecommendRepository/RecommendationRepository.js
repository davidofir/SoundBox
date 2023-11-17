import { doc, getDoc, updateDoc, collection, setDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";

import { authentication, db } from "../../firebase";

export const getListUserReviews = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    var usersReviews = docSnapshot.data().reviewIds
  
  
    console.log(usersReviews)
  
  };