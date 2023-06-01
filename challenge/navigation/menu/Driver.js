import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, ScrollView , Alert} from 'react-native';
import {ref, set, onValue, off, remove } from 'firebase/database';
import {db} from './firebaseConfig';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import { sharedID } from "./Myinfo";

const STORAGE_KEY = '@dest'

export default function Driver({ navigation }) {
  const [dest, setDest] = useState({});
  
  const getLocation = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    const location = await Location.getCurrentPositionAsync({});
    const {longitude, latitude} = location.coords;
    
    //console.log(coordinate);
    setGeoData(sharedID, latitude, longitude);
  }

  const setGeoData = (sharedID, latitude, longitude) => {
    set(ref(db, 'geo/' + sharedID + '/' + 'now/'), {
      userid: sharedID,
      userlatitude: latitude,
      userlongitude: longitude,
    })
    set(ref(db, 'geo/' + sharedID + '/' + 'call/'), {
      id: " ",
      request: 0,
    })
    set(ref(db, 'geo/' + sharedID + '/' + 'recall/'), {
      id: " ",
      response: 0,
    })
      .then(() => console.log('data submitted'))
      .catch(error => console.log(error));
  }

  useEffect(() => {
    getLocation();
  }, [sharedID]);

  useEffect(() => {
      loadDest();
      const destsRef = ref(db, 'DestinationList');
      onValue(destsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDest(data);
        }
      });
      set(ref(db, 'geo/' + sharedID + '/' + 'recall/'),{
        response: 0,
      })
      return () => {
        off(destsRef);
      };
  }, []);
  //console.log(dest);

  const loadDest = async () => {
      try {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        if (s !== null) { //null 아닐경우 
          setDest(JSON.parse(s));
        }
      } catch (e) {
        console.log(e);
      }
  }
  
  const checkRequest = (key) => {
    const data = dest[key];
    Alert.alert(
      "콜 확인",
      "이 콜을 받으시겠습니까???",
      [
        {
          text: "취소",
        },
        {
          text: "확인",
          onPress: () => {
            navigation.navigate('AcceptCall',{data});
          },
        }
      ]
    )
  }

  return (
      <View style={styles.container}>
          <ScrollView style={{marginTop:50}}>
              {Object.keys(dest).map((key) => (
                <TouchableOpacity key={key} onPress={ () => checkRequest(key)}>
                  <View style={styles.toDo} >
                      <Text style={styles.toDoText}>{dest[key].destname}</Text>
                      <Text style={styles.toDoText}>요청자: {dest[key].userid}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>

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
    },
    toDo:{
        backgroundColor:"#3A3D40",
        marginBottom:10,
        paddingVertical:20,
        paddingHorizontal:20,
        borderRadius:20,
        fontSize:50,
        fontWeight:100,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'space-between'
      },
      toDoText:{
        color:"white"
      }
})