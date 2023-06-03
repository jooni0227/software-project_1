import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, Alert} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {ref, set, onValue, update} from 'firebase/database';
import {db} from '../menu/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { sharedID } from "../menu/Myinfo";

const API_KEY = 'AIzaSyBKKgi1itO5j2iJegNmZyGirH_htVycaKA';

export default function ShowMatchingDriver({ navigation }) {
    const [coordinate, setCoord] = useState(null);
    const [ucoordinate, setuCoord] = useState(null);
    const [userId, setUserId] = useState("");

    const polylineCoordinates = [
        coordinate,
        ucoordinate
    ]
    const getGeoData = () => {
        console.log('geo/' + sharedID + '/' + 'now/');
        const getDataref = ref(db, 'geo/' + sharedID + '/' + 'now/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
        const getNameref = ref(db, 'geo/' + sharedID + '/' + 'recall/');
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
            console.log("user path " + 'geo/' + userId + '/' + 'now/');
            const getDataref = ref(db, 'geo/' + userId + '/' + 'now/');
            if(getDataref.key != null)
            {onValue(getDataref, (snapshot) => {
                const data = snapshot.val();
                if(data != null)
                {const lat = data.userlatitude;
                const lng = data.userlongitude;
                setuCoord({
                    latitude: lat,
                    longitude: lng,
                })}
                //console.log("driver location " + coordinate.latitude + " " + coordinate.longitude);
            });}
        }
    } 
    const onPressArrive = () => {
        Alert.alert(
            "알림",
            "도착알림을 보내시겠습니까?",
            [
              {
                text: "취소",
              },
              {
                text: "확인",
                onPress: () => {
                    if(userId != null){
                        update(ref(db, 'geo/' + userId + '/' + 'call/'), {
                            arrive: 1,
                        })
                        .then(() => {
                            console.log('data submitted');
                            navigation.popToTop();
                        })
                        .catch(error => console.log(error));
                    }
                    
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
                description='고객님의 위치입니다.'
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
                onPress={onPressArrive}
                >
                <Text style={{color: 'white', fontSize: 15}}>도착했음을 알리기</Text>
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
    marginTop: 5,
    padding: 15,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#43AA47',
    borderColor: '#43AA47',
  }
});
