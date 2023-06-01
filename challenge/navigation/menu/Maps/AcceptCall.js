import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, ScrollView , Alert} from 'react-native';
import {ref, set, onValue, off, remove, update } from 'firebase/database';
import {db} from '../firebaseConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import { sharedID } from "../Myinfo";

export default function AcceptCall({ navigation }) {
    const [responses, setResponse] = useState(0);
    const [responseid, setResponseID] = useState(' ');
    const [requestid, setRequestID] = useState(' ');

    const data = useRoute();
    //console.log(data.params.data.userid);

    const initialResponseID = () => {
        setResponseID(sharedID);
        //console.log(" Accept call responseid "+ responseid);
    }
    const initialRequestID = () => {
        const id = data.params.data.userid;
        //console.log("acceptcall data "+ data.params.data);
        setRequestID(id);
        console.log(" Accept call requestid "+ requestid);
    }

    useEffect(() => {
        initialResponseID();
        initialRequestID();
        //console.log("Updated Accept call requestid: " + responseid);
    },[])


    useEffect(() => {
        const fetchRequestData = () => {
            initialRequestID();
            if (navigation.isFocused() && requestid != null) {
                const getDataref = ref(db, 'geo/' + requestid + '/' + 'call/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
                onValue(getDataref, (snapshot) => {
                    const data = snapshot.val();
                    const request = data.request;
                    if(navigation.isFocused() && request === 0 ){
                        set(ref(db, 'geo/' + requestid + '/' + 'call/'), {
                            id: responseid,
                            request: 1,
                        })
                    }
                    else{
                        clearInterval(intervalId);
                    }
                });
                console.log("requestdata fetch check");
            }
        }
        
        let intervalId = setInterval(fetchRequestData, 5000);
    
        return () => {
            
            clearInterval(intervalId);
        };
    },[responseid, requestid])

    useEffect(() => {      
        const fetchResponseData = () => {
            try{
                if(responseid != null){
                    initialResponseID();
                    console.log("Updated responseid in fetchdata: " + responseid);
                    const getDataref = ref(db, 'geo/' + responseid + '/' + 'recall/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
                    onValue(getDataref, (snapshot) => {
                        const data = snapshot.val();
                        console.log("data " + data.response);
                        const rdata = data.response;
                        setResponse(rdata);
                        console.log("wait for response");
                        console.log("response " + rdata);
                    });
                }
                if(responses === 1){
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.log("wait for setstate id " + error);
            }
        }

        let intervalId = setInterval(fetchResponseData, 5000);
    
        return () => {
            clearInterval(intervalId);
        };
    },[responseid, requestid])

    useEffect(() => {
        if(responses === 1){
            navigation.goBack();
            navigation.navigate('ShowMatchingDriver');
        }
    },[responses])

    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text>매칭 신호 보내는중</Text>
            </View>
            
        </View>
        
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        justifyContent: 'center',
        alignContent: 'center',
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
      },
      text:{
        justifyContent: 'center',
        alignContent: 'center',
      }

})