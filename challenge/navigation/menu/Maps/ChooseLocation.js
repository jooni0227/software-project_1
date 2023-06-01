import React, {useEffect, useState} from 'react'
import {View,Text,StyleSheet, TouchableOpacity, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {ref, set, onValue} from 'firebase/database';
import {db} from '../firebaseConfig';
import { sharedID } from "../Myinfo";

const API_KEY = 'AIzaSyBKKgi1itO5j2iJegNmZyGirH_htVycaKA';
export default function ChooseLocation({navigation}){

    const [state, setState] = useState({
        Address: {},
        destAddress: {}
    })
    const {Address, destAddress} = state;

    const onDone = () => {
        navigation.navigate('ShowLocation', destAddress);
    }
           
    const setGeoData = (sharedID, latitude, longitude , destname) => {
        set(ref(db, 'geo/' + sharedID + '/' + 'dest/'), {
          userid: sharedID,
          userdest: destname,
          userlatitude: latitude,
          userlongitude: longitude
        })
          .then(() => console.log('data submitted'))
          .catch(error => console.log(error));
    }


    const fetchDestAddressCords = (lat, lng , data) => {
        console.log("lat", lat);
        console.log("lng", lng);
        console.log("data", data);
        setState({...state, destAddress:{
            latitude: lat, 
            longitude: lng
        }});
        setGeoData(sharedID , lat , lng , data);
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                keyboardShouldPersistTaps='handled'
                style={styles.scrollstyle}
            >
                <GooglePlacesAutocomplete
                    placeholder='도착지를 입력하세요'
                    onPress={onPressDetails = (data, details) => {
                        let lat = details.geometry.location.lat;
                        let lng = details.geometry.location.lng;
                        let name = data.structured_formatting.main_text
                        //console.log(name);
                        fetchDestAddressCords(lat, lng, name);
                    }}
                    fetchDetails={true}
                    fetchAddress={fetchDestAddressCords}
                    query={{
                        key: "AIzaSyBKKgi1itO5j2iJegNmZyGirH_htVycaKA",
                        language: 'kor',
                    }}
                    styles={{
                        textInput: styles.inputstyle
                    }}
                />

                <TouchableOpacity
                    style={styles.donebtn}
                    onPress={onDone}
                >
                    <Text>완료</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "blue",
    },
    scrollstyle:{
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
    },
    inputstyle:{
        fontSize: 16,
        height: 48,
        color: 'black',
        backgroundColor: '#F3F3F3'
    },
    donebtn:{
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        hight: 48,
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
    }
})