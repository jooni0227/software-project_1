
import React, { useState } from 'react';
import {View,Text,StyleSheet,Modal,Button, TextInput} from 'react-native';



export default function Community({navigation,route}){
    const {titles,content}=route.params; 

    
    return (
        <View style={styles.container}>
            <Text>{titles}</Text>
            <Text>{content}</Text>
            <Button title="Open Modal" onPress={() => navigation.navigate('Post')} />
            
        </View>    
    );
}



const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
    }
})