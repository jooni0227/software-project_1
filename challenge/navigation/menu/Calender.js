import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {BarChart} from 'react-native-chart-kit';


const MyComponent = () => {

  
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});



  const handleDateSelect = (date) => {
    setSelectedDay(date);
    if(formData && formData[moment(date).format('MM/DD/YYYY')]){
      setShowForm(false);
    }else{
      setShowForm(true);
    }
    
  };

  const handleFormSubmit = (data) => {
    setFormData((prevState) => ({
      ...prevState,
      [moment(selectedDay).format('MM/DD/YYYY')]: data,
    }));
    setShowForm(false);
  };

  
  return (
    <View style={styles.container} >
      <CalendarPicker onDateChange={handleDateSelect} />
      {showForm && (
        <View>
          <Text style={styles.text}>You selected {moment(selectedDay).format('MM/DD/YYYY')}</Text>
          <FormComponent
            onSubmit={handleFormSubmit}
            initialData={formData[moment(selectedDay).format('MM/DD/YYYY')]}
          />
        </View>
      )}
       {formData[moment(selectedDay).format('MM/DD/YYYY')] && (
        <View>
          <Text style={styles.text}>Input data for {moment(selectedDay).format('MM/DD/YYYY')}:</Text>
          <Text style={styles.text}>{JSON.stringify(formData[moment(selectedDay).format('MM/DD/YYYY')])}</Text>
           <Text style={styles.text}>Total: {(
             parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['소주'])
             +parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['맥주'])
             +parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['위스키'])
             +parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['와인']))
             /parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['인원'])}</Text>

              <BarChart
        data={{
          labels: ['소주', '맥주', '위스키', '와인'],
          datasets: [
            {
              data: [parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['소주']),
              parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['맥주']),
              parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['위스키']),
              parseInt(formData[moment(selectedDay).format('MM/DD/YYYY')]['와인'])],
            },
          ],
        }}

        width={Dimensions.get('window').width}
        height={220}
        fromZero={true}
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
        </View>
    )}

      
    </View>
  );
};

const FormComponent = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
   
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="소주"
        onChangeText={(value) => handleInputChange('소주', value)}
        value={formData.input1}
      />
      <TextInput
        style={styles.input}
        placeholder="맥주"
        onChangeText={(value) => handleInputChange('맥주', value)}
        value={formData.input2}
      />
      <TextInput
        style={styles.input}
        placeholder="위스키"
        onChangeText={(value) => handleInputChange('위스키', value)}
        value={formData.input3}
      />
      <TextInput
        style={styles.input}
        placeholder="와인"
        onChangeText={(value) => handleInputChange('와인', value)}
        value={formData.input4}
      />
      <TextInput
        style={styles.input}
        placeholder="인원"
        onChangeText={(value) => handleInputChange('인원', value)}
        value={formData.input5}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.text} >Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  input:{
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text:{
    fontSize: 20,
  }
});
