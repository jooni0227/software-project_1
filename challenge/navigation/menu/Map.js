import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import {ref, set, onValue, update} from 'firebase/database';
import {db} from './firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { sharedID } from "./Myinfo";

const API_KEY = 'AIzaSyBKKgi1itO5j2iJegNmZyGirH_htVycaKA';

export default function Map({ navigation }) {
  const [userId, setUserId] = useState(' ');

  const initialSharedId = () => {
    setUserId(sharedID);
    console.log("Sharedid "+ sharedID);
  }
  
  const [coordinate, setCoord] = useState(null);
  const [destCoord, setdestCoord] = useState({
    destination: {},
  });
  const {destination} = destCoord;
  const [destname, setDestName] = useState("");
  const [check, setDestCheck] = useState({
    checkdest: 0,
  });
  let {checkdest} = check;
  const route = useRoute();
  //console.log(route);

  const setGeoData = (userId, latitude, longitude) => {
    set(ref(db, 'geo/' + userId + '/' + 'now/'), {
      userid: userId,
      userlatitude: latitude,
      userlongitude: longitude,
    })
    set(ref(db, 'geo/' + userId + '/' + 'call/'), {
      id: " ",
      request: 0,
      arrive: 0,
    })
    set(ref(db, 'geo/' + userId + '/' + 'recall/'), {
      id: " ",
      response: 0,
    })
      .then(() => console.log('data submitted'))
      .catch(error => console.log(error));
  }
  

  const getGeoData = () => {
    const getDataref = ref(db, 'geo/' + userId + '/' + 'dest/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
    onValue(getDataref, (snapshot) => {
        const data = snapshot.val();
        const lat = data.userlatitude;
        const lng = data.userlongitude;
        const name = data.userdest;
        setdestCoord({...destCoord, destination:{
          latitude: lat,
          longitude: lng,
        }})
        setDestName(name);
        console.log("destCoord " + destination.latitude + " " + destination.longitude);
    });
  }

  const getLocation = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    const location = await Location.getCurrentPositionAsync({});
    const {longitude, latitude} = location.coords;
    setCoord({
      latitude,
      longitude
    })
    //console.log(coordinate);
    setGeoData(userId, latitude, longitude);
  }

  const onPressLocation = () => {
    navigation.navigate('ChooseLocation');
  }
  
  useEffect(() => {
    initialSharedId();
    if(userId != null){
      getLocation();
    }
  }, [userId]);

  useEffect(() => {
    initialSharedId();
    console.log("checkdest변경하는 event useEffect실행됨")
    let unsubscribe = navigation.addListener('focus', () => {});

    console.log("check " + checkdest);
    if (navigation.isFocused() && userId != null) {
      unsubscribe = navigation.addListener('focus', () => {
        if(route.params != undefined){
          console.log(route.params.checkdest);
          let dest = route.params.checkdest
          setDestCheck(dest);
          console.log("checkdest " + checkdest);
          //console.log("check " + checkdest);
          getGeoData();
        }
      });
    }
    // 화면이 unmount될 때 리스너를 해제합니다.
    return () => {
      unsubscribe;
      checkdest = 0;
      console.log("check below " + checkdest)
    };
  }, [route.params, userId]);

  useEffect(() => {
    //console.log(`checkdest: ${checkdest}`);
  }, [checkdest])

  const requestCall = () => {
    console.log("requestCall " + destination.latitude + " " + destination.longitude)
    set(ref(db, 'DestinationList/' + userId + '/'), {
      userid: userId,
      destname: destname,
      destlatitude: destination.latitude,
      destlongitude: destination.longitude,
    })
      .then(() => console.log('data submitted'))
      .catch(error => console.log(error));

    navigation.navigate('Complete',{userid: userId});
  }
    
 
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
          <Marker coordinate={coordinate} />
          {/* {destination && (<Marker coordinate={destination} />)} */}
        </MapView>
      )}

      {checkdest == 0 && (<View style={styles.box}>
        <Text style={styles.textstyle}>{userId}</Text>
        <TouchableOpacity 
          style={styles.inputstyle}
          onPress={onPressLocation}
          >
          <Text style={{color: 'white', fontSize: 15}}>목적지를 입력하세요</Text>
        </TouchableOpacity>
        
      </View>)}

      {checkdest != 0 && (<View style={styles.anotherBox}>
        {/* <Text style={styles.textstyle}>{userId}</Text> */}
        <Text style={{marginLeft: 10, fontSize: 20, marginTop: 15}}>목적지: {destname}</Text>
        <Text style={{marginLeft: 10, fontSize: 20}}>예상시간: 30분</Text>
        <Text style={{marginLeft: 10, fontSize: 20, marginBottom: 13}}>예상비용: 20000원</Text>
        <TouchableOpacity 
          style={styles.inputstyle}
          onPress={requestCall}
          >
          <Text style={{color: 'white', fontSize: 15}}>콜 하시겠습니까???</Text>
        </TouchableOpacity>
        
      </View>)}   
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
    borderRadius: 30,
  },
  anotherBox: {
    flex: 1.5,
    width:'100%',
    backgroundColor:'white',
    borderRadius: 30,
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
  },
  textstyle:{
    fontSize:30,
    padding: 15,
  },
});
