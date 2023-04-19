import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import * as SQLite from 'expo-sqlite';
import {BarChart} from 'react-native-chart-kit';

const db = SQLite.openDatabase('mydb.db');

db.transaction((tx) => {
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

  const insertData = () => {
    db.transaction((tx) => {
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
    db.transaction((tx) => {
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
                    (opacity = 1) => `#FBC901`,
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
        <View style={{ marginTop: 20 }}>
        
          <Text>Selected Date: {selectedDate.toString()}</Text>
          <Text>{`\nSoju:`}</Text>
          <TextInput
            value={soju}
            onChangeText={(text) => {
              setSoju(text);
            }}
          />
          <Text>{`\nBeer:`}</Text>
          <TextInput
            value={beer}
            onChangeText={(text) => {
              setBeer(text);
            }}
          />
          <Text>{`\nWhisky:`}</Text>
          <TextInput
            value={whisky}
            onChangeText={(text) => {
              setWhisky(text);
            }}
          />
          <Text>{`\nWine:`}</Text>
          <TextInput
            value={wine}
            onChangeText={(text) => {
              setWine(text);
            }}
          />
          <TouchableOpacity onPress={insertData}>
            <Text>{`\nInsert Data`}</Text>
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
