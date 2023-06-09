import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  RefreshControl,
  ScrollView,
  Alert,
  Modal,
  Image,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
//import Ask from './Screens/Ask';
import { sharedID } from "./Myinfo";

export default function Challenges({ navigation }) {
  const [show, setShow] = useState(true);

  const handleButtonClick = () => {
    setShow(false);
  };

  const [clickableIndex, setClickableIndex] = useState(0);
  const [checkclick, setClick] = useState(new Array(30).fill(false));
  // checkclick.map((state) => console.log(state));

  useEffect(() => {
    // 앱 실행 시 checkclick 값 불러오기
    //AsyncStorage.clear();
    AsyncStorage.getItem("checkclick").then((value) => {
      if (value) {
        setClick(JSON.parse(value));
      }
    });
  }, []);

  useEffect(() => {
    const now = new Date();
    const resetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    ); // 다음 날 0시
    const timeUntilReset = resetTime.getTime() - now.getTime();

    setTimeout(() => {
      if (clickableIndex < 30) {
        setClickableIndex(clickableIndex + 1);
      }
    }, timeUntilReset);
  }, [clickableIndex]);

  useEffect(() => {
    // checkclick 값이 변경될 때마다 AsyncStorage에 저장
    AsyncStorage.setItem("checkclick", JSON.stringify(checkclick));
  }, [checkclick]);

  const count = 0;

  const [showModal, setShowModal] = useState(false);
  
  const [showFailModal, setShowFailModal] = useState(false);

  const handleButtonPress = (index) => {
    // 도장 찍는 날을 제외하고는 터치불가
    if (index !== clickableIndex) {
    return;
    }

    const newcheckclick = [...checkclick];
    newcheckclick[index] = true;
    setClick(newcheckclick);
    setClickableIndex(clickableIndex + 1);

    if (clickableIndex >= 20 && index===29) {
      // 도장을 20개 이상 채울 경우 챌린지 성공!,Modal 컴포넌트를 열어 성공 메시지를 띄움
      setShowModal(true);
    } else if (clickableIndex < 20 && index===29) {
      // 도장을 20개 미만으로 채울 경우 챌린지 실패!,Modal 컴포넌트를 열어 실패 메시지를 띄움
      setShowFailModal(true);
    }
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    //scroll refresh
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const retryAlert = () => {
    
    const removeValue = async () => {
      //재도전하기 버튼누르면 'checkclick'정보초기화
      try {
        await AsyncStorage.removeItem("checkclick");
        setShow(true);
        setClick(new Array(30).fill(false));
        setClickableIndex(0);
        setShowModal(false);
        console.log("done");
      } catch (e) {
        console.log("dont");
      }
    };
    
    Alert.alert("재도전", "정말 재도전하실건가요?", [
      {
        text: "취소",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },

      { text: "확인", onPress: removeValue } //확인 누를시 정보초기화 and 도전화면
    ]);
    
  };

  return (
    <View style={styles.container}>
      {show ? (
        <View style={styles.container}>
          <Image 
            style={styles.logo} 
            source={require('../../assets/cartoon.png')}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={handleButtonClick}> 
            <View style={styles.btn}>
              <Text style={{textAlign:'center',fontSize: 30,color:'white'}}>{"도전시작"}</Text>
            </View>
          </TouchableOpacity>
        </View>
        ) : (
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
          <View style={styles.header}>
            <Text style={{ fontSize: 30 }}>{sharedID}님</Text>
            <Text style={{ fontSize: 30 }}>D-{30 - clickableIndex}</Text>
          </View>

          <View style={styles.checkcontainer}>
            {rows.map((row, rowIndex) => (
              <View
                style={{ justifyContent: "center", flexDirection: "row" }}
                key={rowIndex}
              >
                {row.map((state, itemIndex) => {
                  const index = rowIndex * itemsPerRow + itemIndex;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButtonPress(index)}
                      style={{
                        padding: 10,
                        marginRight: itemIndex === itemsPerRow - 1 ? 0 : 10,
                        width: 50,
                        height: 150,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      disabled={index !== clickableIndex}
                    >
                      <Image
                        source={index < clickableIndex ? require("../../assets/false.png") : require("../../assets/true.png")}
                        style={{ width: 24, height:80 }}
                      />
                      <Text style={{ color: 'black', fontSize: 20 }}>{index + 1}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={retryAlert}> 
            <View style={styles.re_btn}>
              <Text style={{textAlign:'center',fontSize: 20,color:'white'}}>{"재도전하기"}</Text>
            </View>
          </TouchableOpacity>
          </ScrollView>
          <Modal animationType="slide" transparent={true} visible={showModal}>
            <View style={styles.modalBackground}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Image 
                    style={styles.good} 
                    source={require('../../assets/good.png')}
                    resizeMode="contain"
                  />
                  <Text style={{ fontSize: 30, padding:10}}> 금주 챌린지 성공!</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#43AA47",
                      padding: 10,
                      borderRadius: 5,
                    }}
                    onPress={retryAlert}
                  >
                    <Text style={{ fontSize: 20, color:"white"  }}>재도전하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal animationType="slide" transparent={true} visible={showFailModal}>
            <View style={styles.modalBackground}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={{ fontSize: 30 }}>실패!</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "lightgray",
                      padding: 10,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    onPress={retryAlert}
                  >
                    <Text style={{ fontSize: 20 }}>재도전</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "black",
    paddingVertical: 30,
    borderRadius: 100,
  },
  txt: {
    fontSize: 50,
    color: "white",
  },
  header: {
    flex: 0.3,
    flexDirection: "row",
    paddingHorizontal: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  check: {
    backgroundColor: "red",
    marginHorizontal: 10,
    marginTop: 30,
    borderRadius: 24,
  },
  checkcontainer: {
    flex: 1.5,
    justifyContent: "center",
    backgroundColor: "white",
  },
  container2: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  header:{
    flex:0.3,
    flexDirection:"row",
    paddingHorizontal:30,
    justifyContent:"space-between",
    alignItems:"center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 70,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  checkfont:{
    marginHorizontal:10,
    fontSize:50,
    color:"red"
  },
  logo:{
    flex:1,
    width:200
  },
  btn:{
    justifyContent: "center",
    width:Dimensions.get("window").width,
    height:80,
    padding:10,
    backgroundColor:'#43AA47', 
    borderTopLeftRadius:100,
    borderTopRightRadius:100,
  },
  re_btn:{
    justifyContent: "center",
    height:40,
    marginTop:10,
    backgroundColor:'#43AA47', 
    borderRadius:10, 
    elevation:5
  },
  good:{
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
