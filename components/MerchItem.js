import { View,Image,StyleSheet,Text, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const MerchItem = props => (
    <View style={[styles.item]}>
        <TouchableOpacity onPress={()=>Linking.openURL(props.url)}>
            <View style={{flexDirection:"row"}}>
                <Image style={styles.square} source={{
                    uri:props.image
                }}/>
                    <View style={styles.center}>
                        <Text style={{textAlignVertical:"center",marginBottom:10,maxWidth:200}}>{props.name}</Text>
                        <Text style={{textAlignVertical:"center"}}>{props.price}</Text>
                    </View>
                </View>
        </TouchableOpacity>
    </View>
  ); 
const styles = StyleSheet.create({
    item:{
        flexDirection:"row",
        padding:10,
    },
    center:{
        justifyContent:"center",
        alignItems:"center"
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