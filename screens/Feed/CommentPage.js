import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';
import { authentication, db } from '../../firebase';
import { doc, getDocs, getDoc, collection, addDoc, setDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";
import { Ionicons } from '@expo/vector-icons';

export default Comment = ({ navigation, route }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { item } = route.params;

    var userId = authentication.currentUser.uid;

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

                tempComments.sort((a, b) => b.upvotes.length - a.upvotes.length);
                setComments(tempComments);
            } else {
                console.error(`Review with ID ${item.id} does not exist.`);
            }
        }

        fetchComments();

    }, [item.id])

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
        }

        setComments((prevComments) => [...prevComments, commentData]);
        await setDoc(commentRef, commentData);

        const reviewRef = doc(db, "reviews", item.id);
        await updateDoc(reviewRef, {
            commentIds: arrayUnion(commentRef.id)
        })

    }

    const LikeComment = (item) => {
        var tempLikes = item.upvotes;

        tempLikes.push(userId)

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'comments', item.id);
        updateDoc(reviewDoc, {
            upvotes: tempLikes
        })
    }

    const UnlikeComment = (item) => {
        var tempLikes = item.upvotes;

        tempLikes.splice(tempLikes.indexOf(userId), 1);

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'comments', item.id);
        updateDoc(reviewDoc, {
            upvotes: tempLikes
        })
    }

    const DislikeComment = (item) => {
        var tempDislikes = item.downvotes;

        tempDislikes.push(userId)

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'comments', item.id);
        updateDoc(reviewDoc, {
            downvotes: tempDislikes
        })
    }

    const UndislikeComment = (item) => {
        var tempDislikes = item.downvotes;

        tempDislikes.splice(tempDislikes.indexOf(userId), 1);

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'comments', item.id);
        updateDoc(reviewDoc, {
            downvotes: tempDislikes
        })
    }

    const deleteComment = async (item) => {
        try {
            const commentRef = doc(db, 'comments', item.id);
            const reviewRef = doc(db, 'reviews', item.reviewId);

            const reviewDoc = await getDoc(reviewRef);

            if (reviewDoc.exists()) {
                var tempComments = reviewDoc.data().commentIds;

                tempComments.splice(tempComments.indexOf(item.id), 1);

                await updateDoc(reviewRef, {
                    commentIds: tempComments
                });

                await deleteDoc(commentRef);

                setComments((prevComments) => prevComments.filter((comment) => comment.id !== item.id));
            } else {
                console.error(`Review with ID ${item.reviewId} does not exist.`);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    const Comment = ({ item, userId, LikeComment, UnlikeComment, DislikeComment, UndislikeComment }) => {
        const [liked, setLiked] = useState(item.upvotes.includes(userId));
        const [disliked, setDisliked] = useState(item.downvotes.includes(userId));

        const handleLike = () => {
            if (liked) {
                UnlikeComment(item);
                setLiked(false);
            } else {
                if (disliked) {
                    UndislikeComment(item);
                    setDisliked(false);
                }
                LikeComment(item);
                setLiked(true);
            }
        }

        const handleDislike = () => {
            if (disliked) {
                UndislikeComment(item);
                setDisliked(false);
            } else {
                if (liked) {
                    UnlikeComment(item);
                    setLiked(false);
                }
                DislikeComment(item);
                setDisliked(true);
            }
        }

        const handleDelete = async () => {
            deleteComment(item);
        }

        return (
            <View style={styles.commentContainer}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.timestampText}>{item.creationTime}</Text>

                <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={liked ? 'chevron-up' : 'chevron-up-outline'}
                            size={20}
                            color={liked ? 'blue' : 'black'}
                            style={styles.likeIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.likeText}>{item.upvotes.length}</Text>

                    <TouchableOpacity onPress={handleDislike}>
                        <Ionicons
                            name={disliked ? 'chevron-down' : 'chevron-down-outline'}
                            size={20}
                            color={disliked ? 'red' : 'black'}
                            style={styles.dislikeIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.dislikeText}>{item.downvotes.length}</Text>

                    {item.userId === userId && (
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteIconContainer}>
                            <Ionicons
                                name="trash-bin-outline"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView>
                <View>
                    {comments.map((item, index) => (
                        <Comment
                            key={index}
                            item={item}
                            userId={userId}
                            LikeComment={LikeComment}
                            UnlikeComment={UnlikeComment}
                            DislikeComment={DislikeComment}
                            UndislikeComment={UndislikeComment}
                        />
                    ))}
                </View>
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor={'#d1d1d1'}
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={AddComment}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    commentContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
    },
    commentUsername: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 16,
        color: 'black',
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
        borderTopColor: '#ededed',
        padding: 20,
        paddingBottom: 45,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d1d1',
        borderRadius: 25,
        paddingHorizontal: 16,
        color: 'black',
    },
    addButton: {
        marginLeft: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#4f4f4f',
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
        color: 'black',
    },
    dislikeIcon: {
        marginLeft: 5,
        marginRight: 5,
    },
    dislikeText: {
        fontSize: 14,
        color: 'black',
    },
    deleteIconContainer: {
        position: 'absolute',
        right: 0,
    },
});