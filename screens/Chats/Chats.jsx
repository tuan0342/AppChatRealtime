import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Distance from '../../utilies/Distance';
import ChatBlock from './ChatBlock';
import ChatSearch from './ChatSearch';
import { firebaseDatabaseRef, db, onValue } from '../../firebase/firebase';
import { storage, storageRef, getDownloadURL } from '../../firebase/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';  // lưu dữ liệu vào thiết bị

function Chats(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    const [searching, setSearching] = useState(false);
    const [textSearch, setTextSearching] = useState('');

    const [allUsersMes, setAllUsersMes] = useState([]); // lưu thông tin tất cả các user trong database
    const [allFriends, setAllFriends] = useState([])  // lưu thông tin tất cả bạn bè trong database
    
    // Lọc user (cho phần tìm kiếm)
    const filteredUsers = () => 
        allUsersMes.filter(eachUser => 
            eachUser.name.toLowerCase().includes(textSearch.toLowerCase()),
        );
    
    
    useEffect(() => {
        // Lấy dữ liệu (bảng  `users`) từ firebase xuống - Reload khi có sự thay đổi của database
        onValue(firebaseDatabaseRef(db, 'users'), async (snapshot) => {
            if(snapshot.exists()) {
                // Lấy giá trị chọc từ db xuống
                let snapshotObject = snapshot.val();  // đối tượng
    
                // Lấy id của bản thân dựa vào 'AsyncStorage'
                let stringUser = await AsyncStorage.getItem("user")  
                let myUserId =  JSON.parse(stringUser).userId 
    
                // Lấy tất cả user trên database rồi lưu vào allUsersMes để hiển thị đoạn hội thoại
                setAllUsersMes(Object.keys(snapshotObject)
                    .filter(eachKey => eachKey != myUserId)  
                    .map( eachKey => { 
                        let eachObject = snapshotObject[eachKey]  // lấy object (đối tượng) theo key
                        let lastMessage = "";
                        let lastTimestamp;

                        let key;
                        if(myUserId < eachKey) key = myUserId + eachKey;
                        else key =  eachKey + myUserId;

                        onValue(firebaseDatabaseRef(db, `conversations/${key}`), async (snapshot) => {
                            if(snapshot.exists()) {
                                console.log("Vào được bên trong")
                                // Lấy giá trị chọc từ db xuống
                                let snapshotObject = snapshot.val();  // đối tượng
                                let updatedConversationChats = Object.keys(snapshotObject)
                                    .filter(item => item.includes(myUserId+"-"+eachKey) || item.includes(eachKey+"-"+myUserId))  
                                    .map(eachKeyConversation => {
                                        let eachObjectConversation = snapshotObject[eachKeyConversation]  // lấy object (đối tượng) theo key
                                        // Nhân bản đối tượng eachObject, đồng thời thêm 1 thuộc tính `isMe` vào đối tượng
                                        return {
                                            ...eachObjectConversation,
                                        }
                                    })
                                    .sort((item1, item2) =>  item1.timestamp - item2.timestamp)  // sắp xếp theo thứ tự tăng dần timestamp

                                    if(updatedConversationChats.length > 0) { 
                                        lastMessage = updatedConversationChats[updatedConversationChats.length - 1].messageText;
                                        lastTimestamp = updatedConversationChats[updatedConversationChats.length - 1].timestamp;
                                    }
                                    else { 
                                        lastMessage = "";
                                        lastTimestamp = "";
                                    }

                            } else {
                                console.log(`Không có dữ liệu khi lấy ở trong file Chats`);
                                lastMessage = "";
                                lastTimestamp = "";
                            }
                        })  
                      
                        return {
                            url: eachObject.avatar,
                            name: eachObject.name,
                            email: eachObject.email,
                            accessToken: eachObject.accessToken,
                            lastMessage: lastMessage,  //lastMessage
                            numberOfUnreadMessage: 0, 
                            userId: eachKey,
                            lastTimestamp: lastTimestamp,
                        }            
                  }))
                
                setAllFriends(allUsersMes.filter(element => element.lastMessage != "")
                  .sort((item1, item2) => - item1.lastTimestamp + item2.lastTimestamp))  // sắp xếp theo thứ tự tăng dần timestamp
                
                // console.log(">>>>>> check allUsersMes: " , allUsersMes) 
            } else {
                console.log(`No data available`);
            }
        })
    }, [allFriends])  //allFriends   

    return(
        <View style={{flex: 1, backgroundColor: '#EDEDED'}}>

            {/* Header */}
            <View style={[styles.headerContainer, {marginBottom: 15}]}>
                <Icon name="search" size={20} color={'#8F8F8F'} style={{marginHorizontal: 5}}/>
                <TextInput 
                    placeholder='Search message...'
                    placeholderTextColor={'#8F8F8F'}
                    onChangeText={text => {
                        if (text.length == 0) {
                            setSearching(false);
                        } else {
                            setSearching(true);
                            setTextSearching(text);
                        }
                    }}
                    style={{paddingHorizontal: 5, fontSize: 15, width: Distance.screenWidth - 130}}
                />
            </View>

            {/* Body */}
            {searching == true 
              ? filteredUsers().length > 0 ? (
                  <FlatList 
                    style={{flex: 1}}
                    data={filteredUsers()}
                    keyExtractor={item => item.userId}
                    renderItem={({item}) => (
                      <ChatSearch
                          user={item}
                          onPress = {() => {
                            navigate('Conversation', {friend: item});
                          }}
                      />
                    )}
                  />
                ) : (
                  <View style={{flex: 1, alignItems: 'center', marginTop: 30}}> 
                    <Text style={{fontSize: 20, color: colors.primary, fontWeight: '600'}}>Not found!</Text>
                  </View>
                )
                
              : <FlatList 
                    style={{flex: 1}}
                    data={allFriends}
                    keyExtractor={item => item.userId}
                    renderItem={({item}) => (
                        <ChatBlock
                            user={item}
                            onPress = {() => {
                              navigate('Conversation', {friend: item});
                            }}
                        />
                    )}
                />}

        </View>
    )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 45, 
    backgroundColor: 'white', 
    marginTop: 25, 
    marginHorizontal: 20, 
    paddingHorizontal: 5, 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center',
  },
})

export default Chats;