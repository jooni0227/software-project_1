import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, Button, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';
import { sharedID } from "../menu/Myinfo";

export default function Login({ navigation }) {
  const route = useRoute();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selectedDday, setSelectedDday] = useState(null);
  const [remainingDays, setRemainingDays] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [MDrink, setMDrink] = useState("");
  const currentMonth = format(date, 'MMMM');
  const currentDateTime = format(date, 'yyyy년 MM월 dd일 HH:mm');


  const handleChallengesPress = () => {
    navigation.navigate('Challenges');
  };

  const handleCommunityPress = () => {
    navigation.navigate('Community');
  };

  const handleDriverPress = () => {
    navigation.navigate('Driver');
  };


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
        'SELECT SUM(soju) as sojuSum, SUM(맥주) as beerSum, SUM(whisky) as whiskySum, SUM(와인) as wineSum FROM calendartable WHERE date >= ?',
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

  const showDatePicker = () => {
    showMode('date');
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
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.infotext}>
          안녕하세요 {sharedID}님!
        </Text>
      </View>
      <View style={styles.graph}>
        <View style={styles.images}>
        <Text style={styles.graph}>음주 통계 현황{"\n"}{currentMonth}</Text>
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
        <Image style={styles.logo2} source={require('../../assets/hand.png')} />
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
        <Text style={styles.dday}>바로가기</Text>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonCircle}>
              <Text style={styles.buttonIcon}>캘린더</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCircle} onPress={handleChallengesPress}>
              <Text style={styles.buttonIcon}>챌린지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCircle} onPress={handleCommunityPress}>
              <Text style={styles.buttonIcon}>커뮤니티</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCircle} onPress={handleDriverPress}>
              <Text style={styles.buttonIcon}>대리기사</Text>
            </TouchableOpacity>
          </View>
        <Text style={styles.timeText}>
          {format(new Date(), 'yyyy년 MM월 dd일 HH:mm')} 접속중
        </Text>
      </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
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
  logo:{
    width:25,
    height:25,
  },
  logo2:{
    width:30,
    height:30,
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
});