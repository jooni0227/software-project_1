import React from 'react'
import {View,Text,StyleSheet,Button} from 'react-native';



export default function Myinfo({navigation}){
    return (
        <View style={styles.container}>
            <Text>Myinfo 화면</Text>
            <Button title="로그인" onPress={() => navigation.navigate('Login')}/>
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