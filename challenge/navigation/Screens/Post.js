import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal,StyleSheet } from 'react-native';

const Post = ({ visible, onClose, onSubmit,navigation}) => {
  const [titles, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    onSubmit(titles, content);
    setTitle('');
    setContent('');
    navigation.navigate('Community');
  }

  const submitHandler = () => {
    navigation.navigate('Community', { titles, content }); // A화면으로 props 전달

  };
  return (
    
      <View style={styles.container}>
        <Text>제목</Text>
        <TextInput value={titles} placeholder='title' onChangeText={setTitle} />
        <Text>내용</Text>
        <TextInput value={content} placeholder='content' onChangeText={setContent} />
        <Button title="등록" onPress={submitHandler} />
        
      </View>
    
  );
}
const styles=StyleSheet.create({
  container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  }
})

export default Post;