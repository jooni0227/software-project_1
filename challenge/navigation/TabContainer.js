import React from 'react'
import {View,Text,StyleSheet,Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import Calender from './menu/Calender';
import Challenges from './menu/Challenges';
import Myinfo from './menu/Myinfo';
import Community from './menu/Community';
//import Map from './menu/Map';
import DriverSelect from './Screens/DriverSelect';



const calender="캘린더";
const challenges="첼린지";
const myinfo="내정보";
const community="커뮤니티";
//const map = "대리기사";
const driverselect = "대리기사";

const Tab=createBottomTabNavigator();

export default function TabContainer(){
    return (
        <Tab.Navigator
          initialRouteName={calender}
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === calender) {
              iconName = 'calendar';
            } else if (rn === challenges) {
              iconName = 'flag';
            } else if (rn === community) {
              iconName = 'users';
            } else if (rn === driverselect) {
              iconName = 'car';
            } else if (rn === myinfo) {
              iconName = 'user';
            }
            return <FontAwesome name={iconName} size={size} color={focused ? 'green':color} />;
          },
      })}
    >
            
            <Tab.Screen name={calender} component={Calender} options={{headerShown:false}}/>
            <Tab.Screen name={community} component={Community} options={{headerShown:false}}/>
            <Tab.Screen name={challenges} component={Challenges} options={{headerShown:false}}/>
            {/* <Tab.Screen name={map} component={Map} options={{headerShown:false}}/> */}
            <Tab.Screen name={driverselect} component={DriverSelect} options={{headerShown:false}}/>
            <Tab.Screen name={myinfo} component={Myinfo} options={{headerShown:false}}/>
        </Tab.Navigator>
    );
}

const styles=StyleSheet.create({

})
