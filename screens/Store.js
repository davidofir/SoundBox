import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native';
const data = [];
for(var i = 0; i < 12; i+=3){
    data.push({
        title:`Shirt${i+1}`
    })
    data.push({
        title:`Hoodie${i+2}`
    })
    data.push({
        title:`Lighter${i+3}`
    })
}
export default Store =()=>{

      const renderItem = ({ item }) => (
        <Item title={item.title} />
      );
    
    return(
        <View>
            <View style={styles.verticalContainer}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item,key) => key}/>
            </View>
        </View>
    )
}
const Item = ({ title }) => (
    <View style={styles.item}>
        <View style={styles.square}/>
            <Text style={{textAlignVertical:"center"}}>{title}</Text>
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
    square: {
        width: 70,
        height: 70,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 15
    },
    item:{
        flexDirection:"row",
        padding:10,
    }
});