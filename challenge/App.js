import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';
// Import the functions you need from the SDKs you need

export default function App(){
    return (
      <NavigationContainer>
        <StackContainer />
      </NavigationContainer>
    );
}


