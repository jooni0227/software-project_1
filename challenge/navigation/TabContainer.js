import React from 'react'
import {View,Text,StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './menu/Home';
import Calender from './menu/Calender';
import Challenges from './menu/Challenges';
import Myinfo from './menu/Myinfo';
import Community from './menu/Community';

const home="홈";
const calender="캘린더";
const challenges="첼린지";
const myinfo="내정보";
const community="커뮤니티";

const Tab=createBottomTabNavigator();

export default function TabContainer(){
    return (
        <Tab.Navigator>
            <Tab.Screen name={home} component={Home} options={{headerShown:false}}/>
            <Tab.Screen name={calender} component={Calender} options={{headerShown:false}}/>
            <Tab.Screen name={challenges} component={Challenges} options={{headerShown:false}}/>
            <Tab.Screen name={community} component={Community} options={{headerShown:false}}/>
            <Tab.Screen name={myinfo} component={Myinfo} options={{headerShown:false}}/>
            
        </Tab.Navigator>
    );
}

const styles=StyleSheet.create({

})