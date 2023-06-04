import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, Dimensions, Image} from 'react-native';
//import {ref, set, onValue} from 'firebase/database';
//import {db} from '../firebaseConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';
import { sharedRole } from '../menu/Myinfo';

export default function DriverSelect({ navigation }) {
    //console.log(sharedRole);
    const onSelect = () => {
        navigation.navigate('Map');
    }
    const onDriverSelect = () => {
        navigation.navigate('Driver');
    }

    return (
        <View style={styles.container}>
            {(sharedRole == '대리기사') && <View style={styles.check}>
                <View style={styles.container}>
                    <Image 
                        style={styles.logo} 
                        source={require('../../assets/driver.png')}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity 
                style={styles.btn}
                onPress={onDriverSelect}
                >
                    <Text style={{textAlign:'center',fontSize: 30,color:'white'}}>지금 출발해 보세요!!!</Text>
                </TouchableOpacity>
            </View>}
            {(sharedRole != '대리기사') && <View style={styles.check}>
                <View style={styles.container}>
                    <Image 
                        style={styles.logo} 
                        source={require('../../assets/driver.png')}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity 
                style={styles.btn}
                onPress={onSelect}
                >
                    <Text style={{textAlign:'center',fontSize: 30,color:'white'}}>이용자</Text>
                </TouchableOpacity>
            </View>}
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        alignItems: "center",
        justifyContent: "center",
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
    },
    btn:{
        justifyContent: "center",
        width:Dimensions.get("window").width,
        height:80,
        padding:10,
        backgroundColor:'#43AA47', 
        borderTopLeftRadius:100,
        borderTopRightRadius:100,
      },
    logo:{
        flex:1,
        width:350
      },
})