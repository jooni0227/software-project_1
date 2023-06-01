import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, Alert} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {ref, set, onValue, update} from 'firebase/database';
import {db} from '../menu/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { sharedID } from "../menu/Myinfo";

const API_KEY = 'AIzaSyBKKgi1itO5j2iJegNmZyGirH_htVycaKA';

export default function ShowMatching({ navigation }) {
    const [coordinate, setCoord] = useState(null);
    const [ucoordinate, setuCoord] = useState(null);
    const [userId, setUserId] = useState("");
    const [arrive, setArrive] = useState(0);

    const polylineCoordinates = [
        coordinate,
        ucoordinate
    ]
    const getGeoData = () => {
        console.log('geo/' + sharedID + '/' + 'now/');
        const getDataref = ref(db, 'geo/' + sharedID + '/' + 'now/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
        const getNameref = ref(db, 'geo/' + sharedID + '/' + 'call/');
        if(getDataref.key != null)
        {onValue(getDataref, (snapshot) => {
            const data = snapshot.val();
            const lat = data.userlatitude;
            const lng = data.userlongitude;
            setCoord({
                latitude: lat,
                longitude: lng,
            })
            //console.log("driver location " + coordinate.latitude + " " + coordinate.longitude);
        });}
        if(getNameref.key != null)
        {onValue(getNameref, (snapshot) => {
            const data = snapshot.val();
            const name = data.id;
            setUserId(name);
            console.log("name "+name);
        });}
    }

    const getUserGeoData = () => {
        if(userId != null){
            console.log("driver path " + 'geo/' + userId + '/' + 'now/');
            const getDataref = ref(db, 'geo/' + userId + '/' + 'now/')
            if(getDataref.key != null){
                onValue(getDataref, (snapshot) => {
                const data = snapshot.val();
                if(data != null)
                {const lat = data.userlatitude;
                const lng = data.userlongitude;
                setuCoord({
                    latitude: lat,
                    longitude: lng,
                })}
                //console.log("driver location " + coordinate.latitude + " " + coordinate.longitude);
                });
            }
        }
    } 
    const onPressRemove = () => {
        Alert.alert(
            "감사합니다",
            "다음에 또 이용해 주세요!!!",
            [
              {
                text: "취소",
              },
              {
                text: "확인",
                onPress: () => {
                  navigation.popToTop();
                },
              }
            ]
          )
    }

    useEffect(() => {
        getGeoData();
        if(userId != null){
            getUserGeoData();
        }
    },[userId])

    useEffect(() => {      
        const fetchData = () => {
            try{
                const getDataref = ref(db, 'geo/' + sharedID + '/' + 'call/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
                onValue(getDataref, (snapshot) => {
                    const data = snapshot.val();
                    const arrive = data.arrive;
                    console.log("wait for arrive");
                    console.log("arrive " + arrive);
                    setArrive(arrive);
                });
                
            } catch (error) {
                console.log(error);
            }
        }

        let intervalId = setInterval(fetchData, 5000);
    
        return () => {
            clearInterval(intervalId);
        };
    },[sharedID])
  
    useEffect(()=>{
        console.log("arrive === 1" + arrive === 1);
        if(arrive === 1){
            //clearInterval(intervalId);
            Alert.alert(
                "알림",
                "기사님이 근처에 도착하셨습니다!!!",
                [
                    {
                    text: "취소",
                    },
                    {
                    text: "확인",
                    onPress: () => {
                        navigation.popToTop();
                    },
                    }
                ]
            )
        }
    },[arrive]);
 
    return (
        <View style={styles.container}>
            {coordinate && (
            <MapView
            key={`${coordinate.latitude},${coordinate.longitude}`}
            style={styles.maps}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}>
            <Marker 
                coordinate={coordinate}
                description='현재 당신의 위치입니다.'
            />
            {ucoordinate && (<Marker 
                coordinate={ucoordinate} 
                description='기사님의 위치 입니다.'
            />)}
            {ucoordinate && (<Polyline 
                coordinates={polylineCoordinates}
                strokeColor="#000"
                strokeWidth={2}
            />)}
            </MapView>
            )}

            <View style={styles.box}>
                <Text>{sharedID}</Text>
                <TouchableOpacity 
                style={styles.inputstyle}
                onPress={onPressRemove}
                >
                <Text>취소 하기</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'white',
  },
  maps: {
    flex: 4,
    width: '100%',
    height: '70%',
  },
  box: {
    flex: 1,
    width:'100%',
    backgroundColor:'white',
  },
  inputstyle: {
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
});
