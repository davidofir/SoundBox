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
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                        <View style={styles.square} />
                        <Text style={{marginLeft:40}}>Merch Item 1</Text>
                        </View>
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
    square: {
        width: 50,
        height: 50,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 30
    }
});