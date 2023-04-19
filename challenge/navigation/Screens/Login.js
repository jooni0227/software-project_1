import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
// import {Button} from 'react-native';
// import {
//   Div,
//   Icon,
//   Input,
//   Dropdown,
//   ThemeProvider,
// } from 'react-native-magnus';

export default function Login(navigation) {

    const selectData = () => {
        db.transaction((txt) => {
        txt.executeSql(
            'SELECT name FROM test WHERE id LIKE ?',
            [id.toString()],
            (_, { rows}) => {
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

  return (
      <View style = {styles.container}>
        <Text>
        안녕하세요, __님!
        </Text>
        <View style = {styles.check}>
      <Text>빈칸</Text>
      </View>
      <View style = {styles.drive}>
      <Text>
      현재 매칭된 대리운전
      </Text></View>
      <View style = {styles.check}>
      <Text>빈칸</Text>
      </View>
      </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
    //padding: 100,
    backgroundColor: '#ffffff'
  },
  check: {
    backgroundColor: '#E6E6E6',
    height : 15
  },
  drive : {
    backgroundColor : '#ffffff',
    height : 100
  }
});