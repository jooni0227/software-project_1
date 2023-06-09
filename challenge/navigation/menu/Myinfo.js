import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Button, Alert,TouchableOpacity,Platform,Dimensions,ScrollView} from 'react-native';
import { Div, Input } from 'react-native-magnus';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { BarChart } from 'react-native-chart-kit';

const db = SQLite.openDatabase('user.db');

db.transaction((txt) => {
  txt.executeSql(
    'CREATE TABLE IF NOT EXISTS final123 (num INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, address TEXT, id TEXT, pw TEXT , nickname TEXT, role TEXT)', // [],
    // (_, result) => {
    //   console.log('테이블 생성 완료');
    // },
    // (_, error) => {
    //   console.log('테이블 생성 실패: ', error);
    // }
  );
});

export let sharedID = ''; // 닉네임 공유
export let sharedRole = '';

export default function Myinfo() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigation = useNavigation();
  const [loginStatus, setLoginStatus] = useState(true);

  const selectData = () => {
    return new Promise((resolve, reject) => {
      db.transaction((txt) => {
        txt.executeSql(
          'SELECT pw, nickname, role FROM final123 WHERE id LIKE ?',
          [id.toString()],
          (_, { rows }) => {
            resolve(rows);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const handlePress = async () => {
    if (id === '') {
      Alert.alert('아이디를 입력하세요.');
      return;
    } else if (pw === '') {
      Alert.alert('비밀번호를 입력하세요.');
      return;
    }

    try {
      const rows = await selectData();

      if (rows.length > 0) {
        const message = rows.item(0);
        console.log(message);

        if (message.pw === pw) {
          sharedID = message.nickname;
          sharedRole = message.role;
          setLoginStatus(false);
        } else {
          Alert.alert('아이디 혹은 비밀번호가 틀렸습니다.\n다시 로그인 해주세요.');
        }
      } else {
        console.log('No data found for this date.');
        message = 'No data';
        Alert.alert('아이디 혹은 비밀번호가 틀렸습니다.\n다시 로그인 해주세요.');
      }
    } catch (error) {
      console.log('SQL error: ', error);
    }
  };
  const logout=()=>{
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      {
        text: "예",
        onPress: async () => {
          setLoginStatus(true);
          setId("");
          setPw("");
        },
      },
      { text: "아니오" },
    ])
    
  }
  //const route = useRoute();
  
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selectedDday, setSelectedDday] = useState(null);
  const [remainingDays, setRemainingDays] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [MDrink, setMDrink] = useState("");


  const calculateRemainingDays = () => {
    if (selectedDday) {
      const today = new Date();
      const differenceInTime = selectedDday.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setRemainingDays(differenceInDays);
    } else {
      setRemainingDays(null);
    }
  };

  const fetchChartData = () => {
    const sqlDB = SQLite.openDatabase('mydb.db');

    sqlDB.transaction((tx) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date one week ago

      tx.executeSql(
        'SELECT SUM(soju) as sojuSum, SUM(beer) as beerSum, SUM(whisky) as whiskySum, SUM(wine) as wineSum FROM calendartable WHERE date >= ?',
        [oneWeekAgo.toISOString()],
        (_, { rows }) => {
          const { sojuSum, beerSum, whiskySum, wineSum } = rows.item(0);

          const chartData = {
            labels: ['소주', '맥주', '위스키', '와인'],
            datasets: [
              {
                data: [sojuSum || 0, beerSum || 0, whiskySum || 0, wineSum || 0],
                colors: [
                  (opacity = 1) => `#03C04A`,
                  (opacity = 1) => `#FBB03B`,
                  (opacity = 1) => `#A94007`,
                  (opacity = 1) => `#940128`,
                ],
              },
            ],
          };

          setChartData(chartData);
          const maxCount = Math.max(sojuSum || 0, beerSum || 0, whiskySum || 0, wineSum || 0);
          let mostConsumed = '';
          if (maxCount === sojuSum) {
            mostConsumed = '소주';
          } else if (maxCount === beerSum) {
            mostConsumed = '맥주';
          } else if (maxCount === whiskySum) {
            mostConsumed = '위스키';
          } else if (maxCount === wineSum) {
            mostConsumed = '와인';
          }
          setMDrink(mostConsumed);
        },
        (tx, error) => {
          console.log(`Error selecting data: ${error}`);
        }
      );
    });
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDday;
    setShow(Platform.OS === 'ios');

    const now = new Date();
    if (currentDate < now) {
      setSelectedDday(now);
    } else {
      setSelectedDday(currentDate);
    }

    calculateRemainingDays();
    console.log(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };


  const completeDateSelection = () => {
    setSelectedDday(null);
    setShow(false);
  };

  const startChallenge = () => {
    const now = new Date();
    const nextDay = selectedDday ? new Date(selectedDday) : now;
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDday(nextDay.getTime());
    setRemainingDays(1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {loginStatus ? (
        <>

        <Image 
                    style={styles.good} 
                    source={require('../../assets/good.png')}
                    resizeMode="contain"
                  />
        <View style={styles.green}>
        <Input
            mx="xl"
            mt="md"
            px="md"
            py="sm"
            borderColor="beige"
            value={id}
            bg="beige"
            borderBottomColor="black"
            onChangeText={(text) => setId(text)}
            prefix={
              <Div row alignItems="center">
                <Button title="ID   " bg="white" alignItems="center" color="black" />
                <Div bg="black" w={1} h={25} ml="sm" />
              </Div>
            }
            keyboardType="email-address"
          />
          <Input
            mx="xl"
            mt="md"
            px="md"
            py="sm"
            borderColor="beige"
            value={pw}
            bg="beige"
            borderBottomColor="black"
            onChangeText={(text) => setPw(text)}
            prefix={
              <Div row alignItems="center">
                <Button title="PW" bg="white" alignItems="center" color="black" />
                <Div bg="black" w={1} h={25} ml="sm" />
              </Div>
            }
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Join')}> 
            <View>
              <Text style={{marginTop:15, marginRight:25, textAlign:'right',fontSize: 18,color:'black', textDecorationLine: 'underline'}}>{"회원가입"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}> 
            <View style={styles.login}>
              <Text style={{textAlign:'center',fontSize: 25,color:'white'}}>{"로그인"}</Text>
            </View>
          </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.info}>
        <Text style={styles.infotext}>
          안녕하세요 {sharedID}님!
        </Text>
      </View>
      <View style={styles.graph}>
        <View style={styles.images}>
        <Text style={styles.graph}>음주 통계 현황{"\n"}{}</Text>
        <Image style={styles.logo} source={require('../../assets/graph.png')} />
        </View>
        {chartData && (
          <BarChart
          data={chartData}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            color: (opacity = 1) => `black`,
            barRadius:20,
          }}
          fromZero={true}
          withHorizontalLabels={false}
          withCustomBarColorFromData={true}
          flatColor={true} // Updated prop name from "flatColor" to "flatColor={true}"
          showBarTops={false}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          style={{
            marginLeft: -25,
            marginTop:-30
          }}
        />
        )}
        {MDrink ? (
          <Text style={styles.setMDrink}>
            현재까지 가장 많이 마신 술은 {MDrink}입니다.{"\n"}줄이도록 노력합시다!
          </Text>
        ) : null }
        <View style={styles.blank}>
        <Text>       </Text>
      </View>
      <View>
      <View style={styles.images}>
        <Text style={styles.dday}>
          금주 도전하기{"\n"}
          {selectedDday !== null ? `D+${remainingDays}` : ""}
        </Text>
        <Image style={styles.logo} source={require('../../assets/hand.png')} />
        </View>
        <TouchableOpacity onPress={startChallenge} style={styles.button}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={completeDateSelection} style={styles.button}>
          <Text style={styles.buttonText}>초기화</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.blank}>
        <Text>      </Text>
      </View>
      <View style={styles.time}>
        <Text style={styles.timeText}>
          {format(new Date(), 'yyyy년 MM월 dd일 HH:mm')} 접속중
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>로그아웃</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
      )}
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
  },
  content: {
    textAlign: 'center',
    fontSize: 23,
    color: '#FF0000',
    flexDirection: 'column',
  },
  content1: {
    fontSize: 19,
    textAlign: 'center',
  },
  logo: {
    width: 25,
    height: 25,
  },
  images: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  info: {
    backgroundColor: '#E0F8E6',
    height: 42,
    fontSize: 35,
    fontWeight: 'bold',
    color:'green'
  },
  infotext: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  blank: {
    backgroundColor: '#E0F8E6',
    height: 6,
  },
  dday: {
    backgroundColor: '#ffffff',
    height: 100,
    color: 'green',
    fontSize: 25,
  },
  graph: {
    backgroundColor: '#ffffff',
    height: 80,
    fontSize: 25,
    color: 'green',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
    height:35,
    marginTop:10,
    paddingVertical:10, 
    backgroundColor:'#43AA47', 
    borderRadius:25, 
    elevation:5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  setMDrink:{
    fontSize:20,
    textAlign: 'center',
    marginBottom: 5,
  },
  images:{
    flexDirection: 'row',
    alignItems: 'right',
  },
  timeText:{
    fontSize: 20,
    color: 'green',
    marginTop: 30,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  buttonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F8E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginRight: 10,
    marginLeft: 10,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    textAlign: 'center',
    marginTop: 20,
  },
  logout:{
    marginTop:30,
    textAlign: 'center',
    color:"green",
    fontWeight:"bold",
    fontSize:19,
  },
  good:{
    marginTop:14,
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  green:{
    width:Dimensions.get("window").width,
    height:1000,
    paddingTop:80,
    backgroundColor:'beige', 
    borderTopLeftRadius:100,
    borderTopRightRadius:100,
  },
  login:{
    justifyContent: "center",
    margin:20,
    marginTop:70,
    height:50,
    padding:10,
    backgroundColor:'#43AA47',
    borderRadius:5,
  },
});