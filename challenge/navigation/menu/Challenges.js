import { StatusBar } from 'expo-status-bar';
import { useState,useEffect} from 'react';
import {TouchableOpacity,StyleSheet,Text,View,Button,RefreshControl,ScrollView,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
//import Ask from './Screens/Ask';


export default function Challenges({navigation}) {

  const [show, setShow] = useState(true);
  
  const handleButtonClick = () => {    
    setShow(false);
  }
 

  const [clickableIndex, setClickableIndex] = useState(0);
  const [checkclick, setClick] = useState(new Array(30).fill(false));
  checkclick.map((state) => console.log(state));

  useEffect(() => {
    // 앱 실행 시 checkclick 값 불러오기
    //AsyncStorage.clear();
    AsyncStorage.getItem('checkclick').then(value => {
      if (value) {
        setClick(JSON.parse(value));
      }
    });
  }, []);

  useEffect(() => {
    const now = new Date();
    const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // 다음 날 0시
    const timeUntilReset = resetTime.getTime() - now.getTime();

    setTimeout(() => {
      if (clickableIndex < 30) {
        setClickableIndex(clickableIndex + 1);
      }
    }, timeUntilReset);
  }, [clickableIndex]);

  useEffect(() => {
    // checkclick 값이 변경될 때마다 AsyncStorage에 저장
    AsyncStorage.setItem('checkclick', JSON.stringify(checkclick));
  }, [checkclick]);

  const count=1;  
  const handleButtonPress = (index) => {
    // 도장 찍는 날을 제외하고는 터치불가
    if (index !== clickableIndex) {
      return;
    }
    
    const newcheckclick = [...checkclick];
    newcheckclick[index] = true;
    setClick(newcheckclick);
    if(index==29){
      navigation.navigate('Success');
    }
    //setClickableIndex(clickableIndex + 1);
  };
  
  const itemsPerRow = 5;
  const rows = checkclick.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / itemsPerRow);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  //asfd

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => { //scroll refresh
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);  
  
  const retryAlert = () => {
    const removeValue=async()=>{ //재도전하기 버튼누르면 'checkclick'정보초기화
    try{
      await AsyncStorage.removeItem('checkclick');
      console.log('done');
    }
    catch(e){
      console.log('dont');
    }
    }

    Alert.alert('재도전', '정말 재도전하실건가요?', [
      {
        text: '취소',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      
      {text: '확인', onPress: removeValue},
    ]);
  }
  

  return (
    <View style={styles.container}>
      {
      show ? (
        <Button style={styles.btn} title="도전시작" onPress={handleButtonClick} />
      ) :
      (
        <View>
          <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.header}>
            <Text style={{fontSize:30}}>ID</Text>
            <Text style={{fontSize:30}}>D-{30 - clickableIndex}</Text>
          </View>

          <View style={styles.checkcontainer}>
            {rows.map((row, rowIndex) => (
              <View style={{ justifyContent:'center',  flexDirection: 'row'}} key={rowIndex}>
                {row.map((state, itemIndex) => {
                  const index = rowIndex * itemsPerRow + itemIndex;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButtonPress(index)}
                      style={{
                        backgroundColor: state ? 'green' : index === clickableIndex ? 'gray' : 'lightgray',
                        padding: 10,
                        marginRight: itemIndex === itemsPerRow - 1 ? 0 : 10,
                        marginTop:20,
                        width:50,
                        height:50,
                        borderRadius:25,
                        borderWidth:1,
                        alignItems:"center"
                      }}
                      disabled={index !== clickableIndex}
                      >
                      <Text style={{ color: 'white' , fontSize:20}}>{index + 1}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
          <Button title="재도전하기" onPress={retryAlert}/>
            <Text>스크롤시 새로고침</Text>
          </ScrollView>
        </View>

      )
      }
    </View>  
  );  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn:{
    backgroundColor:"black",
    paddingVertical:30,
    borderRadius: 100,
  },
  txt:{
    fontSize:50,
    color:"white",
  },
  header:{
    flex:0.3,
    flexDirection:"row",
    paddingHorizontal:30,
    justifyContent:"space-between",
    alignItems:"center",
  },
  check:{
    backgroundColor:"red",
    marginHorizontal:10,
    marginTop:30,
    borderRadius:24,
  },
  checkcontainer:{
    flex:1.5,
    justifyContent:"center",
    backgroundColor:"white",
  },
  container2:{
    backgroundColor:"white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkfont:{
    marginHorizontal:10,
    fontSize:50,
    color:"red"
  }
});
