Join.js
import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import {Button} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {Div, Input} from 'react-native-magnus';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

export default function Join({navigation}) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [nickname, setNickname] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [btnClicked, setBtnClicked] = useState(false);

    const insertData = () => {
        db.transaction((txt) => {
          txt.executeSql(
            'INSERT INTO role (name, age, address, id, pw, nickname, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, address, id, pw, nickname, btnClicked ? '대리기사' : '일반회원'],
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
      if (name === '' || age === '' || address === '' || id === '' || pw === '' || nickname === '') {
        Alert.alert('빈칸을 모두 채워주세요.');
        return;
    }
    if(!btnClicked){
      Alert.alert("대리기사와 일반회원 중 선택해주세요.");
      return;
    }
    if (!isClicked){
      Alert.alert("민감한 개인정보 수집에 동의해주세요.");
      return;
    }
    insertData();
    Alert.alert("환영합니다! 다시 로그인해주세요!");
    navigation.goBack();
  };

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
            title="  Id   :"
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
        <Input
          value={nickname}
          onChangeText={(text) => {
            setNickname(text);
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
            title="닉네임 :"
            bg="white"
            alignItems="center"
            color="black">
            </Button>
            <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          keyboardType="email-address"
        />
      <View style={styles.choose}>
      <View style={styles.buttonContainer}>
      <View style={styles.c1}>
      <BouncyCheckbox
          size={25}
          fillColor="green"
          unfillColor="#FFFFFF"
          text="대리기사"
          iconStyle={{ borderColor: "red" }}
          onPress={() => setBtnClicked(!btnClicked)}
          isClicked={isClicked}/>
          </View>
          <View style={styles.c2}>
          <BouncyCheckbox
          size={25}
          fillColor="green"
          unfillColor="#FFFFFF"
          text="일반회원"
          iconStyle={{ borderColor: "red" }}
          onPress={() => setBtnClicked(!btnClicked)}
          isClicked={isClicked}/>
      </View>      
      </View>
      <View style={styles.check}>
      <BouncyCheckbox
          size={25}
          fillColor="red"
          unfillColor="#FFFFFF"
          text="민감한 개인정보(이름, 주소) 수집 이용 동의"
          iconStyle={{ borderColor: "red" }}
          onPress={() => setIsClicked(!isClicked)}
          isClicked={isClicked}/>
      </View>
      <Button
        title="가입하기"
        color="#01A9DB"
        onPress={handlePress}/>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize:23,
  },
  check: {
    alignItems: 'center',
    textAligh: 'center',
    marginTop: 12,
    fontSize: 16,
  },
  choose: {
    alignItems: 'center',
    textAligh: 'center',
    marginTop: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  c1:{
    marginRight: 10,
  },
});