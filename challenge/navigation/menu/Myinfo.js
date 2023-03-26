import React from 'react'
import {View,Text,StyleSheet} from 'react-native';



export default function Myinfo({navigation}){
    return (
        <View style={styles.container}>
            <Text>Myinfo 화면</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
      },
})