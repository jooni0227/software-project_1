import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Button, TextInput, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback, Keyboard, Dimensions, KeyboardAvoidingView,Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { ref, set, push, onValue, off, remove } from 'firebase/database';
import { db } from './firebaseConfig';
import { sharedID } from "./Myinfo";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function Community() {
  const [ModalVisible, setModalVisible] = useState(false); //게시물등록하는 modal
  const [ModalVisible2, setModalVisible2] = useState(false); //게시한 게시물 보는 modal
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("")
  const [post, setPost] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const { width, height } = Dimensions.get('window');
  const inputWidth = width * 0.85; 
  const inputHeight = height * 0.05;
  const inputWidth2=width*0.97;
  const inputHeight2 = height * 0.55;

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPost(data);
      }
    });
    return () => {
      off(postsRef);
    };
  }, []);

  const doPost = () => {
    if (title === "" && content === "") {
      alert("내용을 입력하세요.");
      return;
    }
    
    const timestamp = Date.now(); // 현재 시간을 밀리초로 나타내는 타임스탬프 생성
    const postRef = ref(db, `posts/${timestamp}`); // 타임스탬프를 post의 키로 사용
    const newPost = {
      nickname : sharedID,
      title,
      content,
      timestamp : timestamp
    };
    
    set(postRef, newPost);
    setModalVisible(false);
    setTitle("");
    setContent("");
    setSelectedPost(null);
  };

  const doComment = () => {
    if(!sharedID){ //로그인 후 작성할수있도록
      Alert.alert("로그인","로그인 후 댓글을 작성할 수 있습니다.")
      return;
    }
    if (comment === "") {
      alert("댓글을 입력하세요.");
      return;
    }

    const newComment = {
      comment,
      nickname:sharedID,
    };
    const postKey = selectedPost.timestamp;
    const commentsRef = ref(db, `posts/${postKey}/comments`);
    const newCommentRef = push(commentsRef);
    set(newCommentRef, newComment);
    
    setComment("");
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelectedPost((prevPost) => ({
          ...prevPost,
          comments: data,
        }));
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setContent("");
    setTitle("")

  }
  const closeModal2 = () => {
    setModalVisible2(false);
    setComment("");
    setSelectedPost(null);
  }

  const deleteToPost = (key) => {
    const postKey = selectedPost.timestamp;
    if (selectedPost.nickname !== sharedID) {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    Alert.alert("삭제", "삭제하시겠습니까?", [
      {
        text: "예",
        onPress: async () => {
          const newPost = { ...post };
          delete newPost[postKey];
          setPost(newPost);
          remove(ref(db, `posts/${postKey}`));
          setModalVisible2(false);
        },
      },
      { text: "아니오" },
    ]);
    return;
  }
  const doDeleteComment = (commentKey) => {
    const postKey = selectedPost.timestamp;
    if (selectedPost.comments[commentKey].nickname !== sharedID) {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    Alert.alert("삭제","해당 댓글을 삭제하시겠습니까?",[
      {
        text:"예",
        onPress:()=>{
          const commentRef = ref(db, `posts/${postKey}/comments/${commentKey}`);
          remove(commentRef);
          Alert.alert("삭제","삭제완료!");
          onValue(commentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setSelectedPost((prevPost) => ({
                ...prevPost,
                comments: data,
              }));
            }
          });
        }
      },
      {text:"아니오"},
    ]);
  };
  

  const openPost = (selectedPost) => {
    setSelectedPost(selectedPost);
    setModalVisible2(true);
  };

  const textInputRef = useRef(null);
  const handlePressOutside = () => {
    Keyboard.dismiss(); //여백 터치시 keyboard 사라짐
  }

  const truncateText = (text, maxLength) => { 
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  const writePost=()=>{
    if(!sharedID){
      Alert.alert("로그인","로그인 후 게시물을 작성할 수 있습니다.");
      return;
    }
    setModalVisible(!ModalVisible);
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.keys(post).reverse().map((key) => (
          <TouchableOpacity style={styles.container3} key={key} onPress={() => openPost(post[key])}>
            <View style={{flexDirection:'row'}}>
                  <Image style={styles.logo} source={require('../../assets/good.png')}/>
                  <Text style={styles.nickname}>{[post[key].nickname]}</Text>
            </View>
            <Text style={styles.timestamp}>{new Date(post[key].timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
            <View style={[styles.post,{width:inputWidth}]}>
              <Text style={styles.title}>{post[key].title}</Text>
              <Text style={styles.content}>{truncateText(post[key].content, 15)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <TouchableOpacity onPress={writePost}>
          <Octicons name="pencil" size={40} color="green" />
        </TouchableOpacity>
      </View>

      <View>
        <Modal visible={ModalVisible} animationType={"slide"} >
          <TouchableWithoutFeedback onPress={handlePressOutside}>
            <View style={styles.container2}>
              <View style={{ flexDirection: "row",justifyContent: 'space-between',marginBottom:30,marginRight:10, }}>
                <TouchableOpacity onPress={closeModal} style={{marginLeft:7}}>
                  <AntDesign name="close" size={27} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={doPost}>
                  <Text style={styles.postbtn}>등록</Text>
                </TouchableOpacity>
              </View>
              <Text style={{fontSize:20,fontWeight:'bold',marginLeft:12}}>제목</Text>
              <TextInput ref={textInputRef} style={[styles.inputtitle,{width:inputWidth2}]} value={title} placeholder='제목을 입력하세요' onChangeText={setTitle} />
              <Text style={{fontSize:20,fontWeight:'bold',marginLeft:12,marginTop:10,}}>내용</Text>
              <TextInput ref={textInputRef} style={[styles.inputcontent,{width:inputWidth2, height:inputHeight2}]} multiline={true} value={content} placeholder='내용을 입력하세요' onChangeText={setContent} />
              <View>
                <Text style={{fontSize:15,fontWeight:'bold',color:'gray',marginLeft:20,marginTop:5}}>커뮤니티 이용수칙</Text>
                <Text style={styles.rule}>즐겁고 건강한 커뮤니티를 위해 다음과 같은 이용수칙을 준수해 주시기 바랍니다.</Text>
                <Text style={styles.rule}>1. 상호 존중</Text>
                <Text style={styles.rule}>2. 비방 및 모욕 금지</Text>
                <Text style={styles.rule}>3. 정치 및 사회 관련 행위 금지</Text>
                <Text style={styles.rule}>4. 스팸 및 광고 금지</Text>
                <Text style={styles.rule}>5. 서로 도움과 협력</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {selectedPost && (
          <Modal presentationStyle={"pageSheet"} visible={ModalVisible2}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={10}>
              <View style={styles.select_post}>
              <TouchableOpacity onPress={closeModal2}>
                  <AntDesign name="close" size={30} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.delete_post} title="" onPress={() => deleteToPost(selectedPost.key)}>
                  <AntDesign name="delete" size={30} color="green" />
                </TouchableOpacity>
                <ScrollView>
                <View style={{flexDirection:'row'}}>
                  <Image style={styles.logo} source={require('../../assets/good.png')}/>
                  <Text style={styles.nickname}>{selectedPost.nickname}</Text>
                </View>
                <Text style={styles.timestamp}>{new Date(selectedPost.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.select_title}>{selectedPost.title}</Text>
                <Text></Text>
                <Text style={styles.select_content}>{selectedPost.content}</Text>
                <Text></Text>
                <View style={styles.elem}></View>
                {selectedPost.comments &&
                  Object.keys(selectedPost.comments).reverse().map((key) => (
                    <View style={styles.comment} key={key}>
                      <Text style={styles.commentnickname}>{selectedPost.comments[key].nickname}</Text>
                      <View style={{flexDirection:"row",justifyContent: 'space-between',}}>
                        <Text>{selectedPost.comments[key].comment}</Text>
                        <TouchableOpacity onPress={() => doDeleteComment(key)}>
                          <Text style={{color:"#FF4000"}}>삭제</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                ))}
                  </ScrollView>
                    <View style={{position: 'absolute',bottom: 40,left: 0,right: 0, flexDirection:"row"}}>
                      <TextInput  style={[styles.inputcomment, { width: inputWidth, height: inputHeight }]} placeholder='comment' value={comment} onChangeText={setComment} />
                        <TouchableOpacity onPress={doComment}>
                          <FontAwesome style={{ width: inputWidth, height: inputHeight, marginTop:15 }} name="paper-plane-o" size={30} color="green" />
                        </TouchableOpacity>  
                    </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2:{
    flex:1,
    marginTop:50,
  },
  container3:{
    borderWidth:0.8,
    borderLeftColor: "white",
    borderRightColor: "white",
    borderTopColor: "#D0F5A9",
    borderBottomColor: "#D0F5A9",
  },
  logo:{
    marginLeft:10,
    marginTop:20,
    width:40,
    height:40,
    resizeMode: 'contain',
    borderColor:'black',
    borderWidth: 0.5,
    borderRadius: 8,
  },
  nickname:{
    marginTop:25,
    marginLeft:6,
    fontSize:20,
    fontWeight:'bold',
  },
  btn: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
  },
  title:{
    fontWeight:'bold',
    fontSize:20,
  },
  content:{
    fontSize:15,
  },
  timestamp: {
    textAlign: 'right',
    marginRight:10,
    marginBottom:10,
    fontSize: 10,
    color: 'gray',
  },
  delete_post:{
    position: 'absolute',
    top: 5,
    right: 5,
  },
  inputtitle: {
    margin: 5,
    height: 50,
    //width: 400,
    borderColor: "#43AA47",
    borderWidth: 1.5,
    borderRadius:10,
  },
  inputcontent: {
    margin: 5,
    height: 580,
    //width: 400,
    borderColor: "#43AA47",
    borderWidth: 1.5,
    flexShrink: 1,
    borderRadius:10,
  },
  inputcomment: {
    margin: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius:10,
    justifyContent: 'space-around',
    paddingHorizontal: 10,

  },
  select_post: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'flex-start',
    justifyContent: 'left',
  },
  select_title: {
    marginTop: 10,
    marginLeft:10,
    alignItems: 'flex-start',
    fontWeight: 'bold',
    fontSize: 30,
  },
  select_content: {
    marginLeft:10,
    marginTop: 0,
    alignItems: 'flex-start',
    fontSize: 20,
    marginBottom: 1,
  },
  elem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#D0F5A9',
    borderBottomWidth: 2.5,
    padding: 5,
  },
  post: {
    backgroundColor: "#F5FBEF",
    borderWidth: 1,
    borderLeftColor: "#D0F5A9",
    borderRightColor: "#D0F5A9",
    borderTopColor: "#D0F5A9",
    borderBottomColor: "#D0F5A9",
    width: 350,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  comment:{
    backgroundColor: "white",
    borderWidth: 1,
    borderLeftColor: "#F5FBEF",
    borderRightColor: "#F5FBEF",
    borderTopColor: "#F5FBEF",
    borderBottomColor: "#D0F5A9",
    width: 390,
    marginBottom: 0.5,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  commentnickname:{
    fontWeight:'bold',
    fontSize:15,
  },
  postbtn:{
    fontWeight:'bold',
    fontSize:20,
  },
  rule:{
    marginTop:5,
    marginLeft:20,
    fontSize:11,
    color:'gray',
  }
});
