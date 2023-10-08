// UserPageViewModel.js
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../firebase";
import * as SecureStore from 'expo-secure-store';
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";

const useUserPageViewModel = (params) => {
    const { item } = params;
    const [user, setUser] = useState({});
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const currId = authentication.currentUser.uid;

    // Function to generate a chat room ID
    const generateRoom = async (user1, user2) => {
        const combinedId = [user1, user2].sort().join('-');
        const existingRoom = await SecureStore.getItemAsync(combinedId);
        if (!existingRoom) {
            await SecureStore.setItemAsync(combinedId, 'exists');
        }
        return combinedId;
    };

    // Function to handle follow/unfollow
    const handleFollowToggle = () => {
        if (isFollowing) {
            unfollowUser();
        } else {
            followUser();
        }
    };

    // Function to unfollow user
    const unfollowUser = () => {
        const tempFollowers = [...user.followers];
        const tempFollowing = [...user.following];
        const indexToRemove = tempFollowers.indexOf(currId);

        if (indexToRemove !== -1) {
            tempFollowers.splice(indexToRemove, 1);
            tempFollowing.splice(tempFollowing.indexOf(item.id), 1);

            UserRepository.updateUserFollowers(item.id, tempFollowers);
            UserRepository.updateUserFollowing(currId, tempFollowing);

            setIsFollowing(false);
        }
    };

    // Function to follow user
    const followUser = () => {
        const tempFollowers = [...user.followers];
        const tempFollowing = [...user.following];

        tempFollowers.push(currId);
        tempFollowing.push(item.id);

        UserRepository.updateUserFollowers(item.id, tempFollowers);
        UserRepository.updateUserFollowing(currId, tempFollowing);

        setIsFollowing(true);
    };

    // Function to handle the message button press
    const handleMessagePress = async () => {
        const roomId = await generateRoom(item.id, currId);
        console.log(roomId);
        navigation.navigate("Chat", {
            roomId: roomId
        });
    };

    useEffect(() => {
        const userRef = doc(db, "users", item.id);
        const currUserRef = doc(db, "users", currId);

        getDoc(userRef).then((doc) => {
            setUser(doc.data() || {});
            setFollowersCount(doc.data()?.followers?.length || 0);
            setFollowingCount(doc.data()?.following?.length || 0);
            setReviews(doc.data()?.reviews || []);

            if (doc.data()?.followers?.includes(currId)) {
                setIsFollowing(true);
            }
        });

        getDoc(currUserRef).then((doc) => {
            setUserFollowers(doc.data()?.followers || []);
            setUserFollowing(doc.data()?.following || []);
        });
    }, []);

    return {
        user,
        followersCount,
        followingCount,
        reviews,
        isFollowing,
        handleFollowToggle,
        handleMessagePress,
    };
};

export default useUserPageViewModel;