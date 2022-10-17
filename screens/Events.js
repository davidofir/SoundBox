import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default Events =({navigation})=>{
    return(
        <View>
            <View style={styles.verticalContainer}>
            </View>
            <View style={[styles.verticalContainer, { justifyContent: "center" }]}>
                <View>
                    <Text>Upcoming Events</Text>
                    <View style={{ marginTop: 50, paddingBottom: 50 }}>
                        <Text>Event 1</Text>
                        <Text>Event 2</Text>
                        <Text>Event 3</Text>
                        <Text>Event 4</Text>
                        <Text>Event 5</Text>
                        <Text>Event 6</Text>
                        <Text>Event 7</Text>
                        <Text>Event 8</Text>
                        <Text>Event 9</Text>
                        <Text>Event 10</Text>
                        <Text>Event 11</Text>
                        <Text>Event 12</Text>
                        <Text>Event 13</Text>
                        <Text>Event 14</Text>
                        <Text>Event 15</Text>
                        <Text>Event 16</Text>
                        <Text>Event 17</Text>
                        <Text>Event 18</Text>
                        <Text>Event 20</Text>
                        <Text>Event 21</Text>
                        <Text>Event 22</Text>
                        <Text>Event 23</Text>
                        <Text>Event 24</Text>
                        <Text>Event 25</Text>
                        <Text>Event 26</Text>
                        <Text>Event 27</Text>
                        <Text>Event 28</Text>
                        <Text>Event 29</Text>
                    </View>
                </View>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    verticalContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'flex-start',
        margin: 10,
        width: 'auto',
        height: "auto"

    },
    horizontalContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
});