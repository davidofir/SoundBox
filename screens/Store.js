import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View,FlatList,Image } from 'react-native';
import GetMerchByArtistName from '../domain/ArtistRepository/ArtistRepository';
import MerchRepositoryImpl from '../domain/MerchAPI/MerchRepositoryImpl';
const merchRepo = new MerchRepositoryImpl;


    
export default Store =({route,navigation})=>{
    const [data,setData] = useState([]);
    useEffect(()=>{
        setData([]);
        var fetchData = async()=>{
            var resp = await GetMerchByArtistName(route.params.artistName)
            return resp;
        }
        fetchData().then(
            (result)=>{
                if(result !== undefined){
                setData(result)
                }
            }
        )
        
    },[])
      const renderItem = ({ item }) => (
        <Item name={item.name} image={item.image} />
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
const Item = ({ name,image }) => (
    <View style={styles.item}>
        <Image style={styles.square} source={{
            uri:image
        }}/>
            <Text style={{textAlignVertical:"center"}}>{name}</Text>
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
        width: 150,
        height: 150,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 15
    },
    item:{
        flexDirection:"row",
        padding:10,
    }
});