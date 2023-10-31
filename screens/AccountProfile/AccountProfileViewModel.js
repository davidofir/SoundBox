import { useState, useEffect } from "react";
import { authentication, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";

const useProfileViewModel = (navigation) => {
    const [username, setUsername] = useState("");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUserProfileData = async () => {
            try {
                const userData = await UserRepository.getUserProfileData();
                const user = authentication.currentUser;
                if (userData) {
                    setUsername(userData.userName);
                    setFollowers(userData.followers || []);
                    setFollowing(userData.following || []);
                    setReviews(userData.reviews || []);

                    if (user) {
                        setUserEmail(user.email);
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile data:", error);
            }
        };

        fetchUserProfileData();
    }, []);

    const navigateToFollowers = () => {
        // Navigate to the Followers screen with the followers data
        navigation.navigate("Followers", { followerArray: followers });
    };

    const navigateToFollowing = () => {
        // Navigate to the Following screen with the following data
        navigation.navigate("Following", { followingArray: following })
    };

    return { username, followers, following, reviews, userEmail, navigateToFollowers, navigateToFollowing };
};

export default useProfileViewModel;