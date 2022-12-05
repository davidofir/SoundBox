import { View,Image,StyleSheet,Text } from "react-native";

const MerchItem = props => (
    <View style={styles.item}>
        <Image style={styles.square} source={{
            uri:props.image
        }}/>
            <Text style={{textAlignVertical:"center"}}>{props.name}</Text>
    </View>
  ); 
const styles = StyleSheet.create({
    item:{
        flexDirection:"row",
        padding:10,
    },
    square: {
        width: 150,
        height: 150,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 15
    },
})
  export default MerchItem