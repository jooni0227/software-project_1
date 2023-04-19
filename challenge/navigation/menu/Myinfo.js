import { useState  } from 'react';
import { Text, View, StyleSheet, Image, Button, Platform } from 'react-native';
import { Div, Input } from 'react-native-magnus';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase('user.db');

db.transaction((txt) => {
  txt.executeSql(
    'CREATE TABLE IF NOT EXISTS test (num INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, address TEXT, id TEXT, pw TEXT)',
    // [],
    // (_, result) => {
    //   console.log('테이블 생성 완료');
    // },
    // (_, error) => {
    //   console.log('테이블 생성 실패: ', error);
    // }
  );
});


export default function Myinfo() {
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [address, setAddress] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [txt, setText] = useState('');
  const navigation = useNavigation();


const selectData = () => {
    db.transaction((txt) => {
    txt.executeSql(
        'SELECT pw FROM test WHERE id LIKE ?',
        [id.toString()],
        (_, { rows}) => {
            // console.log('조회된 사용자 정보: ', rows);
            if(rows.length >0){
                const message = rows.item(0);
                console.log(message);
                setText(message);
            }
            else{
                console.log('No data found for this date.');
                const message = 'No data';
                setText(message);
            }
        },
        (_, error) => {
        console.log('SQL error: ', error);
        }
    );
    });
    };
    const handlePress = () => {
        selectData();
        if(txt.Pw === pw){
            navigation.navigate('Login')}
      }

    return (
      <View style={styles.container}>
        <Text style = {styles.title}>
          {"\n"}로그인 페이지 입니다.{"\n"}
            (나중에 로고로 변환)
        </Text>
        <Input
            mx="xl"
            mt="md"
            px="md"
            py="sm"
            borderColor="gray200"
            borderWidth={2}
            value={id}
            onChangeText={(text) => setId(text)}
            prefix={
            <Div row alignItems="center">
              <Button
                title="Id :"
                bg="white"
                alignItems="center"
                color="black"/>
              <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
            }
            keyboardType="email-address"/>
        <Input
            mx="xl"
            mt="md"
            px="md"
            py="sm"
            borderColor="gray200"
            borderWidth={2}
            value={pw}
            onChangeText={(text) => setPw(text)}
            prefix={
            <Div row alignItems="center">
              <Button
              title="Pw :"
              bg="white"
              alignItems="center"
              color="black">
              </Button>
              <Div bg="gray200" w={1} h={25} ml="sm" />
            </Div>
          }
          secureTextEntry={true}/>
        <Button
          title="로그인"
          color="#00ff00"
          onPress={handlePress}
          />
          
        <Text style = {styles.content}>
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            아직 회원가입을 하지 않았다면 주목!!!
        </Text>
      <View style={styles.images}>
        <Image style={styles.logo} source={require('../menu/car.jpg')} />
          <Text>       </Text>
        <Image style={styles.logo} source={require('../menu/no1.jpg')} />
      </View>
        <Text style = {styles.content1}>
        - 금주, 절주를 하고싶지만 의지가 약하신분들{"\n"}
        - 빠르고 간편하게 대리운전 매칭을 원하시는 분들{"\n"} 
        께서는 아래 회원가입 버튼을 눌러주시기 바랍니다!
        </Text>
        <Button
          title="회원가입"
          color="#01A9DB"
          onPress = {() => navigation.navigate('Join')}/>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title:{
    textAlign: 'center',
    fontSize :30,
  },
  content:{
    textAlign: 'center',
    fontSize : 23,
    color : '#FF0000',
    flexDirection:'column',
  },
  content1:{
    fontSize:19,
    textAlign: 'center',
  },
  logo:{
    width:100,
    height:100
  },
  images:{
    flexDirection: 'row',
    alignItems: 'center',
  }
});