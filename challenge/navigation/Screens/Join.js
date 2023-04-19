import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import {Button} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  Div,
  Input} from 'react-native-magnus';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('user.db');

export default function Join({navigation}) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    
    const insertData = () => {
        db.transaction((txt) => {
          txt.executeSql(
            'INSERT INTO test (name, age, address, id, pw) VALUES (?, ?, ?, ?, ?)',
            [name, age, address, id, pw],
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) {
                console.log('새로운 사용자 정보가 추가되었습니다.');
              }
            },
            (_, error) => {
              console.log('SQL error: ', error);
            }
          );
        });
    };

    const handlePress = () => {
        insertData();
        alert("환영합니다! 다시 로그인해주세요!");
        navigation.goBack();
      }
    
  return(
    <View>
      <Text style={styles.title}>
        {"\n"}회원가입 페이지입니다.{"\n"}
      </Text>
      <Input
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          mx="xl"
          mt="md"
          px="md"
          py="sm"
          borderColor="gray200"
          borderWidth={2}
          prefix={
            <Div row alignItems="center">
            <Button
            title="이름 :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="email-address"
        />
      <Input
          value={age}
          onChangeText={(text) => {
            setAge(text);
          }}
          mx="xl"
          mt="md"
          px="md"
          py="sm"
          borderColor="gray200"
          borderWidth={2}
          prefix={
            <Div row alignItems="center">
            <Button
            title="나이 :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="phone-pad"
        />
      <Input
          value={address}
          onChangeText={(text) => {
            setAddress(text);
          }}
          mx="xl"
          mt="md"
          px="md"
          py="sm"
          borderColor="gray200"
          borderWidth={2}
          prefix={
            <Div row alignItems="center">
            <Button
            title="주소 :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="email-address"
        />
      <Input
          value={id}
          onChangeText={(text) => {
            setId(text);
          }}
          mx="xl"
          mt="md"
          px="md"
          py="sm"
          borderColor="gray200"
          borderWidth={2}
          prefix={
            <Div row alignItems="center">
            <Button
            title="  Id  :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="email-address"
        />
      <Input
          value={pw}
          onChangeText={(text) => {
            setPw(text);
          }}
          mx="xl"
          mt="md"
          px="md"
          py="sm"
          borderColor="gray200"
          borderWidth={2}
          prefix={
            <Div row alignItems="center">
            <Button
            title=" Pw  :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="email-address"
        />
      <View style={styles.check}> 
      <BouncyCheckbox
          size={25}
          fillColor="red"
          unfillColor="#FFFFFF"
          text="민감한 개인정보(주소) 수집 이용 동의"
          iconStyle={{ borderColor: "red" }}/>
      </View>
      <Button
        title="가입하기"
        color="#01A9DB"
        onPress={handlePress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize:23,
  },
  check: {
    textAligh: 'center'
  }
});


