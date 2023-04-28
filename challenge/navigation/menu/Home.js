import React, { useState } from 'react';
import { View, TextInput,Text, Button } from 'react-native';
import {ref, set} from 'firebase/database';
import {db} from './firebaseConfig'


export default function LoginScreen() {
   const [id, setID] = useState('');
   const [password, setPassword] = useState('');
   
   const handleLogin = () => {
      set(ref(db,'users/'+id),{
         id:id,
         password: password
      })
         .then(() => console.log('data submitted'))
         .catch(error => console.log(error));
   }
   
   return (
      <View>
         <Text>ID:</Text>
         <TextInput value={id} onChangeText={setID} />
         <Text>Password:</Text>
         <TextInput secureTextEntry value={password} onChangeText={setPassword} />
         <Button title="Log in" onPress={handleLogin} />
      </View>
   );
}
