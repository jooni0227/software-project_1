import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity} from 'react-native';
//import {ref, set, onValue} from 'firebase/database';
//import {db} from '../firebaseConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

export default function DriverSelect({ navigation }) {

    const onSelect = () => {
        navigation.navigate('Map');
    }
    const onDriverSelect = () => {
        navigation.navigate('Driver');
    }

    return (
        <View style={styles.container}>
            <View style={styles.check}>
                <TouchableOpacity 
                style={styles.inputstyle}
                onPress={onDriverSelect}
                >
                    <Text>운전자</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.check}>
                <TouchableOpacity 
                style={styles.inputstyle}
                onPress={onSelect}
                >
                    <Text>이용자</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    maps: {
        flex: 4,
        width: '100%',
        height: '70%',
    },
    check:{
        flex: 1,
        backgroundColor:'white',
    },
    inputstyle:{
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        hight: 48,
        justifyContent: 'center',
        marginTop: 50,
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
    }
})