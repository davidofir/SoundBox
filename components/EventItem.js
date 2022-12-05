import { Text,View,StyleSheet } from "react-native";
const EventItem = props => (
    <View>
            <Text>{props.city},{props.country}</Text>
            <View style={{flexDirection:"row"}}>
                <Text>Date:{props.date}</Text><Text> at {props.time}</Text>
            </View>
    </View>
  ); 
  export default EventItem;