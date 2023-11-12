import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';
import { authentication, db } from '../../firebase';
import { doc, getDocs, getDoc, collection, addDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";
import { Ionicons } from '@expo/vector-icons';

export default Comment = ({ navigation, route }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { item } = route.params;

    useEffect(() => {

        const fetchComments = async () => {
            const tempComments = [];
            const reviewRef = doc(db, 'reviews', item.id);
            const docSnapshot = await getDoc(reviewRef);

            if (docSnapshot.exists()) {
                const reviewData = docSnapshot.data();

                for (let i = 0; i < reviewData.commentIds.length; i++) {
                    const commentRef = doc(db, "comments", reviewData.commentIds[i]);
                    const commentDoc = await getDoc(commentRef);

                    if (commentDoc.exists()) {
                        const userComment = commentDoc.data();
                        tempComments.push(userComment);
                    } else {
                        console.error(`Comment with ID ${reviewData.commentIds[i]} does not exist.`);
                    }
                }

                setComments(tempComments);
            } else {
                console.error(`Review with ID ${item.id} does not exist.`);
            }
        };

        fetchComments();

    }, [item.id]);

    const AddComment = async () => {
        const user = authentication.currentUser;
        const userData = await UserRepository.getUserProfileData();

        // Get a reference to the comments collection
        const commentsCollectionRef = collection(db, "comments");

        // Check if the comments collection exists
        const commentsCollectionSnapshot = await getDocs(commentsCollectionRef);

        // If the collection doesn't exist, create it
        if (commentsCollectionSnapshot.empty) {
            await addDoc(commentsCollectionRef, { placeholder: true });
        }

        const commentRef = doc(commentsCollectionRef);

        const commentData = {
            id: commentRef.id, // Firestore generated unique ID
            userId: user.uid,
            reviewId: item.id,
            username: userData.userName,
            comment: newComment,
            creationTime: new Date().toISOString(),
            upvotes: [],
            downvotes: [],
        };

        setComments((prevComments) => [...prevComments, commentData]);
        await setDoc(commentRef, commentData);

        const reviewRef = doc(db, "reviews", item.id);
        await updateDoc(reviewRef, {
            commentIds: arrayUnion(commentRef.id)
        });

    };

    const Comment = ({ item, userId, LikeComment, UnlikeComment }) => {

        return (
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentUsername}>{item.username}</Text>
                        <Text style={styles.commentText}>{item.comment}</Text>
                        <Text style={styles.timestampText}>
                            {item.creationTime}
                        </Text>
                    </View>
                )}
            />
        );

    }

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentUsername}>{item.username}</Text>
                        <Text style={styles.commentText}>{item.comment}</Text>
                        <Text style={styles.timestampText}>
                            {item.creationTime}
                        </Text>
                        <View style={styles.likeContainer}>
                            <TouchableOpacity>
                                <Ionicons
                                    name={'chevron-up'}
                                    size={20}
                                    color={'white'}
                                    style={styles.likeIcon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.likeText}>0</Text>
                            <TouchableOpacity>
                                <Ionicons
                                    name={'chevron-down'}
                                    size={20}
                                    color={'white'}
                                    style={styles.dislikeIcon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.dislikeText}>0</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={AddComment}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1f2e',
    },
    commentContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#29293d',
    },
    commentUsername: {
        fontSize: 16,
        color: 'white',
    },
    commentText: {
        fontSize: 16,
        color: 'white',
        marginTop: 1,
    },
    timestampText: {
        fontSize: 12,
        color: '#8c8c9c',
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#29293d',
        padding: 20,
        paddingBottom: 35
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#1f1f2e',
        borderWidth: 1,
        borderColor: '#29293d',
        borderRadius: 25,
        paddingHorizontal: 16,
        color: 'white',
    },
    addButton: {
        marginLeft: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    likeIcon: {
        marginRight: 5,
    },
    likeText: {
        fontSize: 14,
        color: 'white',
    },
    dislikeIcon: {
        marginLeft: 5,
        marginRight: 5,
    },
    dislikeText: {
        fontSize: 14,
        color: 'white',
    },
});