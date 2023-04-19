import React from 'react'
import {View,Text,StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabMenu from './TabContainer';
import Ask from './Screens/Ask';
import Challenges from './menu/Challenges';
import Success from './Screens/Success'
import Join from './Screens/Join';
import Login from './Screens/Login';
const tabMenu="바른음주생활길잡이";
const ask="Ask"
const challenges="첼린지"
const success="Success"
const join="Join"
const login="Login"
//const test="Test"
//<Stack.Screen name={test} component={Test} options={{}}/>

const Stack=createStackNavigator();

export default function StackContainer(){
    return (
        <Stack.Navigator>
            <Stack.Screen name={tabMenu} component={TabMenu} options={{}}/> 
            <Stack.Screen name={ask} component={Ask} options={{}}/>
            <Stack.Screen name={challenges} component={Challenges} options={{}}/>
            <Stack.Screen name={success} component={Success} options={{}}/>
            <Stack.Screen name={login} component={Login} options={{}}/>
            <Stack.Screen name={join} component={Join} options={{}}/>
        </Stack.Navigator>
    );
}

const styles=StyleSheet.create({

})