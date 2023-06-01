import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Image, Button } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import * as SQLite from 'expo-sqlite';
import {BarChart} from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
export let sharedDate = null;

const sqlDB = SQLite.openDatabase('mydb.db');
sqlDB.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS calendartable (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, soju TEXT, beer TEXT, whisky TEXT, wine TEXT)'
  );
});


export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [soju, setSoju] = useState('');
  const [beer, setBeer] = useState('');
  const [whisky, setWhisky] = useState('');
  const [wine, setWine] = useState('');
  const [text, setText] = useState('');
  const [chartData, setChartData] = useState(null);
  const navigation = useNavigation();

  const insertData = () => {
    sqlDB.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO calendartable (date, soju, beer, whisky, wine) VALUES (?, ?, ?, ?, ?)',
        [selectedDate.toString(), soju, beer, whisky, wine],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('Data inserted successfully!');
          }
        },
        (tx, error) => {
          console.log(`Error inserting data: ${error}`);
        }
      );
    });
  };

  const selectData = (date) => {
    sharedDate = date.toString();
    sqlDB.transaction((tx) => {
      tx.executeSql(
        'SELECT soju, beer, whisky, wine FROM calendartable WHERE date LIKE ?',
        [date.toString()],
        (_, { rows }) => {
          if (rows.length > 0) {
            const { soju, beer, whisky, wine } = rows.item(0);
            const message = `소주: ${soju=='' ? 0 : soju}병, 맥주: ${beer=='' ? 0 : beer}병, 위스키: ${whisky=='' ? 0 : whisky}잔, 와인: ${wine=='' ? 0 : wine}잔`;
            const chartData = {
              labels: ['소주', '맥주', '위스키', '와인'],
              datasets: [
                {
                  data: [parseInt(soju=='' ? 0 : soju), parseInt(beer=='' ? 0 : beer), parseInt(whisky=='' ? 0 : whisky), parseInt(wine=='' ? 0 : wine)],
                  colors: [
                    (opacity = 1) => `#03C04A`,
                    (opacity = 1) => `#FBB03B`,
                    (opacity = 1) => `#A94007`,
                    (opacity = 1) => `#940128`]
                },
              ],
            };
            setChartData(chartData); // set the chart data as the state
          
            console.log(message);
            setText(message);
          } else {
            const message = 'No data found for this date.';
            console.log(message);
            setText(message);
          }
        },
        (tx, error) => {
          console.log(`Error selecting data: ${error}`);
        }
      );
    });
  };


  return (
    <ScrollView>
    <View style={{ backgroundColor: "white", flex: 1, padding: 20 }}>
      <CalendarPicker
        onDateChange={(date) => {
          setSelectedDate(date);
          selectData(date);
        }}
      />
      { text == "No data found for this date."&& selectedDate && (
          <View>
          <Text style={styles.text}>{`Soju | 소주`}</Text>
          <View style={styles.inputContainer}>
          <Image source={require('../../assets/soju.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="몇 병 드셨나요?"
            value={soju}
            onChangeText={(text) => {
              setSoju(text);
            }}
          />
          </View>
          
          <Text style={styles.text}>{`Beer | 맥주 `}</Text>
          <View style={styles.inputContainer}>
          <Image source={require('../../assets/beer.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="몇 병 드셨나요?"
            value={beer}
            onChangeText={(text) => {
              setBeer(text);
            }}
          />
          </View>

          <Text style={styles.text}>{`Whisky | 위스키`}</Text>
          <View style={styles.inputContainer}>
          <Image source={require('../../assets/whisky.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="몇 잔 드셨나요?"
            value={whisky}
            onChangeText={(text) => {
              setWhisky(text);
            }}
          />
          </View>
        
          <Text style={styles.text}>{`Wine | 와인 `}</Text>
          <View style={styles.inputContainer}>
          <Image source={require('../../assets/wine.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="몇 잔 드셨나요?"
            value={wine}
            onChangeText={(text) => {
              setWine(text);
            }}
          />
          </View>
          
          <TouchableOpacity onPress={()=>navigation.navigate('Scan')}> 
          <View style={styles.button_scan}>
            <Text style={styles.btn_txt} >{`영수증 인식하기`}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={insertData}>
          <View style={styles.button_insert}>
            <Text style={styles.btn_txt} >{`저장하기`}</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      )}
        {/* <Text>{text}</Text> */}
        {text != "No data found for this date." && chartData && (
        <BarChart
          data={chartData}
          width={350}
          height={350}
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
          flatColor={true}
          showBarTops={false}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          style={
            {marginLeft: -25}
          }
        />
        )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius:100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin:5,
    width: 40,
    height: 40,
    borderRadius:100,
  },
  input: {
    flex: 1,
    height: 40,
  },
  text:{
    paddingTop:10,
    paddingBottom:3,
    paddingLeft:20,
  },
  button_scan:{
    height:40,
    marginTop:25,
    paddingVertical:10, 
    backgroundColor:'#43AA47', 
    borderRadius:10, 
    elevation:5
  },
  button_insert:{
    height:40,
    marginTop:15,
    paddingVertical:10, 
    backgroundColor:'#43AA47', 
    borderRadius:10, 
    elevation:5
  },
  btn_txt:{
    fontSize:20, 
    color:'white',
    textAlign:'center'
  },
  modal:{
    flexDirection:'row-reverse', 
    padding:10
  }

  })