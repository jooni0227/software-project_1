import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity} from 'react-native';
import {ref, set, onValue} from 'firebase/database';
import {db} from '../firebaseConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

export default function ShowLocation({ navigation }) {

    const route = useRoute();
    const dest = route.params;
    console.log(dest)

    const onDone = () => {
        navigation.navigate('Map', {checkdest: 1});
    }

    return (
        <View style={styles.container}>
            <MapView
            style={styles.maps}
            initialRegion={{
                latitude: dest.latitude,
                longitude: dest.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            >
                <Marker coordinate={dest} />
            </MapView>
            <View style={styles.check}>
                <TouchableOpacity 
                style={styles.inputstyle}
                onPress={onDone}
                >
                    <Text style={{color: 'white', fontSize: 15}}>목적지로 설정</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor:'white',
    },
    maps: {
        flex: 4,
        width: '100%',
        height: '70%',
    },
    check:{
        flex: 1,
        width:'100%',
        backgroundColor:'white',
        borderRadius: 30,
    },
    inputstyle:{
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        hight: 48,
        justifyContent: 'center',
        marginTop: 40,
        padding: 15,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#43AA47',
        borderColor: '#43AA47',
    }
})