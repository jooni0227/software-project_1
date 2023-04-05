import React from 'react'
import {View,Text,StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabMenu from './TabContainer';
import Ask from './Screens/Ask';
import Challenges from './menu/Challenges';
import Post from './Screens/Post'
import Login from './Screens/Login';
const tabMenu="바른음주생활길잡이";
const ask="Ask"
const challenges="첼린지"
const post="Post";
const login="Login";


const Stack=createStackNavigator();

export default function StackContainer(){
    return (
        <Stack.Navigator>
            <Stack.Screen name={tabMenu} component={TabMenu} options={{}}/> 
            <Stack.Screen name={ask} component={Ask} options={{}}/>
            <Stack.Screen name={challenges} component={Challenges} options={{}}/>
            <Stack.Screen name={post} component={Post} options={{}}/>
            <Stack.Screen name={login} component={Login} options={{}}/>
        </Stack.Navigator>
    );
}

const styles=StyleSheet.create({

})