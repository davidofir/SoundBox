import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const data = []
for(var i = 0; i < 50; i++){
    data.push(
        {title:`Event${i+1}`}
    )
}
export default Events = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <Item title={item.title} />
      );
    return (
        <View>

            <View style={[styles.verticalContainer, { marginTop:"5%" }]}>
                <View style={styles.verticalContainer}>

                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, key) => key} />

                </View>
            </View>

        </View>
    )
}
const Item = ({ title }) => (
    <View style={styles.item}>
            <Text>{title}</Text>
    </View>
  ); 
const styles = StyleSheet.create({
    verticalContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'center',
        margin: 10,
        width: 'auto',
        height: "auto",

    },
    horizontalContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
    item:{
        flexDirection:"row",
        padding:7,
    }
});