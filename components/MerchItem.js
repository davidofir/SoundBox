import { View,Image,StyleSheet,Text, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const MerchItem = props => (
    <View style={styles.item}>
        <TouchableOpacity onPress={()=>Linking.openURL(props.url)}>
            <Image style={styles.square} source={{
                uri:props.image
            }}/>
                <Text style={{textAlignVertical:"center"}}>{props.name}</Text>
        </TouchableOpacity>
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