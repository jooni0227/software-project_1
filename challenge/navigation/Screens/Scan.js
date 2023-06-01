import React, { useRef, useState } from 'react';
import { View, Button, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {db} from '../menu/firebaseConfig'
import {ref, set, onValue} from 'firebase/database';
import { manipulateAsync } from 'expo-image-manipulator';
import * as SQLite from 'expo-sqlite';
import { sharedDate } from "../menu/Calender";
import { useNavigation } from '@react-navigation/native';

// Google Cloud Vision API key
const API_KEY = 'AIzaSyAkDd1eHSf8ydHpQcu9wcmfawqyqecvd50';
const sqlDB = SQLite.openDatabase('mydb.db');

export default function App() {
  const cameraRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [soju, setSoju] = useState('');
  const [beer, setBeer] = useState('');
  const [whisky, setWhisky] = useState('');
  const [wine, setWine] = useState('');
  const navigation = useNavigation();
  const transformedText = [];
  const handleCapturePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const photo = await cameraRef.current.takePictureAsync();
      setImageUri(photo.uri);
    }
    
  };

  const handleSendImage = async () => {
    if (imageUri) {
      const { uri } = await manipulateAsync(imageUri, [], {
        compress: 1,
        format: 'jpeg',
      });

      set(ref(db,'images'),{
        uri: uri,
      });
      setImageUri(null);
    }
  };

  const handleGetImageAndScan = async () => {
    setShowModal(true);
    onValue(ref(db,'images/'), async (snapshot)=>{
        const imageUri = snapshot.val().uri;

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const base64Image = await manipulateAsync(imageUri, [], {
          compress: 1,
          format: 'jpeg',
          base64: true,
        });

        try {
          const response = await fetch(
            'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY,
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  requests: [
                    {
                      image: {
                        content: base64Image.base64,
                      },
                      features: [
                        {
                          type: 'TEXT_DETECTION',
                        },
                      ],
                    },
                  ],
                }),
              }
            );
            
            const data = await response.json();
            const recognizedText = data.responses[0].fullTextAnnotation.text;
            const recognizedLines = recognizedText.split('\n');
            const quantityIndex = recognizedLines.indexOf("수량");

            for(let i = 1; i<quantityIndex; i++){
              const item = recognizedLines[i];
              const quantity = recognizedLines[i+quantityIndex];
              if(item ==="소주"){
                setSoju(quantity);
              }
              else if(item === "맥주"){
                setBeer(quantity);
              }
              else if(item === "위스키"){
                setWhisky(quantity);
              }
              else if(item === "와인"){
                setWine(quantity);
              }
              console.log("상품명: "+item+"   "+quantity+"개\n");
              transformedText.push([item,quantity]);
            }
            setRecognizedText(transformedText);
          } catch (error) {
            console.log('Error during API request:', error);
          }
        }
      });
    };

    const insertData = () => {
      sqlDB.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO calendartable (date, soju, beer, whisky, wine) VALUES (?, ?, ?, ?, ?)',
          [sharedDate.toString(), soju, beer, whisky, wine],
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
      setShowModal(false)
      navigation.goBack();
    };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef} />
      <Button title="영수증 사진찍기" onPress={handleCapturePhoto} />
      <Button title="이미지 보내기" onPress={handleSendImage} disabled={!imageUri} />
      <Button title="Get Image and Scan Text" onPress={handleGetImageAndScan} />
      <Modal animationType="slide" transparent={true} visible={showModal}>
            <View style={styles.modalBackground}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                {recognizedText.length > 0 ? (
                    recognizedText.map(([item, quantity]) => (
                      <Text style={{ fontSize: 20 }} key={`${item}-${quantity}`}>{item}: {quantity}</Text>
                    ))
                  ) : (
                    <Text>인식하지 못했습니다. 다시해주세요.</Text>
                  )}
                  <TouchableOpacity
                    style={{
                      marginTop:20,
                      backgroundColor: "#43AA47",
                      padding: 10,
                      borderRadius: 5,
                      marginBottom:-30
                    }}
                    onPress={insertData}
                  >
                    <Text style={{ fontSize: 20, color:"white"  }}>저장하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});