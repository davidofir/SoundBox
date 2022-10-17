import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default Store =()=>{
    return(
        <View>
            <View style={styles.verticalContainer}>
            </View>
            <View style={[styles.verticalContainer, { justifyContent: "center" }]}>
                <View>
                    <View style={{ marginTop: 50, paddingBottom: 50 }}>
                        <Text>Merch Item 1</Text>
                        <Text>Merch Item 2</Text>
                        <Text>Merch Item 3</Text>
                        <Text>Merch Item 4</Text>
                        <Text>Merch Item 5</Text>
                        <Text>Merch Item 6</Text>
                        <Text>Merch Item 7</Text>
                        <Text>Merch Item 8</Text>
                        <Text>Merch Item 9</Text>
                        <Text>Merch Item 10</Text>
                        <Text>Merch Item 11</Text>
                        <Text>Merch Item 12</Text>
                        <Text>Merch Item 13</Text>
                        <Text>Merch Item 14</Text>
                        <Text>Merch Item 15</Text>
                        <Text>Merch Item 16</Text>
                        <Text>Merch Item 17</Text>
                        <Text>Merch Item 18</Text>
                        <Text>Merch Item 20</Text>
                        <Text>Merch Item 21</Text>
                        <Text>Merch Item 22</Text>
                        <Text>Merch Item 23</Text>
                        <Text>Merch Item 24</Text>
                        <Text>Merch Item 25</Text>
                        <Text>Merch Item 26</Text>
                        <Text>Merch Item 27</Text>
                        <Text>Merch Item 28</Text>
                        <Text>Merch Item 29</Text>
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