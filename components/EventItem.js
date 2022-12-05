import { Text,View,StyleSheet } from "react-native";
import { countryToAlpha2, countryToAlpha3 } from "country-to-iso";
import CountryFlag from "react-native-country-flag";

const EventItem = props => {
    const isoCode = countryToAlpha2(props.country)
    return(
    <View style={{margin:10}}>
        <View style={{flexDirection:"row"}}>
            <CountryFlag isoCode={isoCode} size={35}/>
            <View style={{marginLeft:10}}>
                <Text>{props.city},{props.country}</Text>
                <View style={{flexDirection:"row"}}>
                    <Text>Date:{props.date}</Text><Text> at {props.time}</Text>
                </View>
            </View>
        </View>
    </View>
  )}; 
  export default EventItem;