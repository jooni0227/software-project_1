import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Text, TouchableOpacity, ScrollView , Alert, ActivityIndicator} from 'react-native';
import {ref, set, onValue, off, remove, update } from 'firebase/database';
import {db} from '../menu/firebaseConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, CommonActions } from '@react-navigation/native';
import { sharedID } from "../menu/Myinfo";

export default function Complete({ navigation }) {
    const [requests, setRequest] = useState(0);
    const [requestid, setRequestID] = useState(' ');
    const [responseid, setResponseID] = useState(' ');
    const data = useRoute();

    const initialRequestID = () => {
        const id = data.params.userid;
        console.log("id "+ id);
        setRequestID(id);
        console.log("requestid "+ requestid);
    }
    useEffect(() => {
        initialRequestID();
        console.log("Updated requestid: " + requestid);
    },[data.params.userid, requestid])

    
    

    useEffect(() => {      
        const fetchData = () => {
            try{
                if(requestid != null){
                    initialRequestID();
                    console.log("Updated requestid in fetchdata: " + requestid);
                    const getDataref = ref(db, 'geo/' + requestid + '/' + 'call/'); //test를 이용하는 유저 실제id를 불러와서 사용가능해야함
                    onValue(getDataref, (snapshot) => {
                        const data = snapshot.val();
                        console.log("data " + data.request);
                        const rdata = data.request;
                        const idata = data.id;
                        setRequest(rdata);
                        setResponseID(idata);
                        console.log("wait for commit");
                        console.log("request " + rdata);
                        console.log("responseid " + idata);
                    });
                }
                if(requests === 1){
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.log("wait for setstate id " + error);
            }
        }

        let intervalId = setInterval(fetchData, 5000);
    
        return () => {
            clearInterval(intervalId);
        };
    },[requestid])

    useEffect(() => {
        const fetchResponseData = () => {
            console.log("responseid " + responseid);
            if(responseid != null && requests === 1){
                console.log("call complete " + requests);
                set(ref(db, 'geo/' + responseid + '/' + 'recall/'), {
                    id: requestid,
                    response: 1,
                })
                .then(() => {
                    console.log('geo/' + responseid + '/' + 'recall/')
                    console.log('response data submitted');
                    navigation.goBack();
                    navigation.navigate('ShowMatching');
                })
                .catch(error => console.log(error));
                
                clearInterval(intervalId);
            }
        }
        let intervalId = setInterval(fetchResponseData, 5000);
    
        return () => {
            
            clearInterval(intervalId);
        };
        
    },[requests,responseid]);

    return (
        <View style={styles.container}>
            <Text style={{marginBottom: 10}}>근처의 기사님을 기다리고 있습니다!</Text>
            <ActivityIndicator size="large" color="blue" />
        </View>
        
        );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
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