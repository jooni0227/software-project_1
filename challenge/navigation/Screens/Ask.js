
import React, { useState } from 'react';
import {Button,View,Text,StyleSheet,CheckBox,TextInput,TouchableOpacity} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RadioGroup from 'react-native-radio-buttons-group';
import Challenges from '../menu/Challenges';

export default function Ask({navigation}){

    const [radioButton, setRadioButton] = useState([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: '금주',
            value: '금주'
        },
        {
            id: '2',
            label: '절주',
            value: '절주'
        },
    ]); 
    function onPressRadioButton(radioButtonsArray) {
        setRadioButton(radioButtonsArray);
    }

    const [radioButtons, setRadioButtons] = useState([
        {
            id: '3', // acts as primary key, should be unique and non-empty string
            label: '7일',
            value: '7일'
        },
        {
            id: '4',
            label: '15일',
            value: '15일'
        },
        {
            id: '5',
            label: '30일',
            value: '30일'
        }
    ]); 

    function onPressRadioButtons(radioButtonsArrays) {
        setRadioButtons(radioButtonsArrays);
    }
    const [show,setShow]=useState(true);
    const handleButtonCLick=(p)=>{
        setShow(false);
    }


    const [press,setPress]=useState(false);
    const pressed=()=>setPress(true);

    return (
        <View style={styles.container}>
            <Text>금주or절주</Text>
            <View style={styles.checkbox2}>
                <RadioGroup radioButtons={radioButton} onPress={onPressRadioButton} layout='row'/>    
            </View>
            <Text>첼린지 기간설정</Text>
            <View style={styles.checkbox2}>
                <RadioGroup radioButtons={radioButtons} onPress={onPressRadioButtons} layout='row'/>    
            </View>
            <TouchableOpacity style={styles.btn} onPress={ ()=>navigation.navigate('Challenges')&&pressed}>
                <Text style={styles.txt}>도전시작</Text>
            </TouchableOpacity> 
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    checkbox:{
        margin:10,
    },
    checkbox2:{
        flexDirection:"row",
    },
    txt:{
        fontSize:50,
        color:"white",
    },
    
    btn:{
        backgroundColor:"black",
        paddingVertical:30,
        borderRadius: 100,
    },

})