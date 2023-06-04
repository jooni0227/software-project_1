import React from 'react'
import {View,Text,StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabMenu from './TabContainer';
import Ask from './Screens/Ask';
import Challenges from './menu/Challenges';
import Post from './Screens/Post'
import Community from './menu/Community';
import ChooseLocation from './menu/Maps/ChooseLocation';
import ShowLocation from './menu/Maps/ShowLocation';
import Map from './menu/Map';
import DriverSelect from './Screens/DriverSelect';
import Join from './Screens/Join';
import Driver from './menu/Driver';
import AcceptCall from './menu/Maps/AcceptCall';
import Scan from './Screens/Scan';
import Complete from './Screens/Complete';
import ShowMatching from './Screens/ShowMatching';
import ShowMatchingDriver from './Screens/ShowMatchingDriver';

const tabMenu="바른음주생활길잡이";
const ask="Ask"
const challenges="첼린지"
const post="Post";
const community="Community";
const chooselocation="ChooseLocation";
const showLocation="ShowLocation";
const map="Map"
const join="Join"
const driverselect="DriverSelect"
const driver="Driver"
const acceptcall="AcceptCall";
const scan = "Scan";
const complete="Complete";
const showmatching="ShowMatching";
const showmatchingdriver="ShowMatchingDriver";

const Stack=createStackNavigator();

export default function StackContainer(){
    return (
        <Stack.Navigator>
            <Stack.Screen name={tabMenu} component={TabMenu} options={{}}/> 
            <Stack.Screen name={ask} component={Ask} options={{}}/>
            <Stack.Screen name={challenges} component={Challenges} options={{}}/>
            <Stack.Screen name={community} component={Community} options={{}}/>
            <Stack.Screen name={post} component={Post} options={{}}/>
            <Stack.Screen name={chooselocation} component={ChooseLocation} options={{}}/>
            <Stack.Screen name={showLocation} component={ShowLocation} options={{}}/>
            <Stack.Screen name={map} component={Map} options={{}}/>
            <Stack.Screen name={join} component={Join} options={{}}/>
            <Stack.Screen name={driverselect} component={DriverSelect} options={{}}/>
            <Stack.Screen name={driver} component={Driver} options={{}}/>
            <Stack.Screen name={acceptcall} component={AcceptCall} options={{}}/>
            <Stack.Screen name={scan} component={Scan} options={{}}/>
            <Stack.Screen name={complete} component={Complete} options={{}}/>
            <Stack.Screen name={showmatching} component={ShowMatching} options={{}}/>
            <Stack.Screen name={showmatchingdriver} component={ShowMatchingDriver} options={{}}/>
        </Stack.Navigator>
    );
}

const styles=StyleSheet.create({

})