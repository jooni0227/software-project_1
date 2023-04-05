import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal,StyleSheet } from 'react-native';

const Post = ({ visible, onClose, onSubmit,navigation}) => {
  const [titles, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    onSubmit(titles, content);
    setTitle('');
    setContent('');
  }

  const submitHandler = () => {
    navigation.navigate('Community', { titles, content }); // A화면으로 props 전달
    
  };
  return (
    
      <View style={styles.container}>
        <Text>제목</Text>
        
        <Text>내용</Text>
        <TextInput value={content}  />
        <Button title="등록" _onPress={submitHandler} />
        
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