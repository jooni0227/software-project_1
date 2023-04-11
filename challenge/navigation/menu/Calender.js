import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import * as SQLite from 'expo-sqlite';
import {BarChart} from 'react-native-chart-kit';

const db = SQLite.openDatabase('mydb.db');

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS abctable (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, soju TEXT, beer TEXT, whisky TEXT, wine TEXT)'
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
        'INSERT INTO abctable (date, soju, beer, whisky, wine) VALUES (?, ?, ?, ?, ?)',
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

  const selectData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT soju, beer, whisky, wine FROM abctable WHERE date LIKE ?',
        [selectedDate.toString()],
        (_, { rows }) => {
          if (rows.length > 0) {
            const { soju, beer, whisky, wine } = rows.item(0);
            const message = `Soju: ${soju}, Beer: ${beer}, Whisky: ${whisky}, Wine: ${wine}`;
            const chartData = {
              labels: ['소주', '맥주', '위스키', '와인'],
              datasets: [
                {
                  data: [parseFloat(soju), parseFloat(beer), parseFloat(whisky), parseFloat(wine)],
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                },
              ],
            };
            setChartData(chartData); // set the chart data as the state
          
            console.log(message);
            setText(message);
          } else {
            console.log('No data found for this date.');
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
        }}
      />
      {selectedDate && (
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
          <TouchableOpacity onPress={selectData}>
            <Text>{`\nSelect Data`}</Text>
          </TouchableOpacity>
        </View>
      )}
        <Text>{text}</Text>
        {chartData && (
        <BarChart
          data={chartData}
          width={350}
          height={220}
          fromZero={true}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        )}
    </View>
    </ScrollView>
  );
}
