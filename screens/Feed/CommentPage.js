import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';
import { authentication, db } from '../../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default Comment = ({ navigation }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {

    }, []);

    const handleAddComment = async () => {
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentText}>{item.text}</Text>
                        <Text style={styles.timestampText}>
                            {item.timestamp.toDateString()}
                        </Text>
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
                <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
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
        borderBottomColor: Colors.lightGray,
    },
    commentText: {
        fontSize: 16,
        color: Colors.white,
    },
    timestampText: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        padding: 8,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: Colors.darkGray,
        borderRadius: 8,
        paddingHorizontal: 16,
        color: Colors.white,
    },
    addButton: {
        marginLeft: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    addButtonText: {
        color: Colors.white,
    },
});