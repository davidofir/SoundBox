import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';
import { authentication, db } from '../../firebase';
import { doc, getDocs, getDoc, collection, addDoc, setDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";
import { Ionicons } from '@expo/vector-icons';
import useCommentPageViewModel from './CommentViewModel';

export default Comment = ({ navigation, route }) => {
    const { item } = route.params;

    const { comments, newComment, setComments, setNewComment, AddComment, LikeComment, UnlikeComment, DislikeComment, UndislikeComment, deleteComment, Comment } = useCommentPageViewModel(route.params);

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
});