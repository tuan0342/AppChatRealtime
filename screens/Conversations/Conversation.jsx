import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Keyboard
} from 'react-native';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Distance from '../../utilies/Distance';
import ConversationBlocks from './ConversationBlocks';
import AsyncStorage from '@react-native-async-storage/async-storage';  // lưu dữ liệu vào thiết bị
import { 
    firebaseDatabaseRef, 
    firebaseSet, 
    db, 
    onValue
} from '../../firebase/firebase';
import { addHours } from '../../utilies/DateTime';

const heightScreen = Distance.screenHeight;

function Conversation(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    const {friend} = props.route.params;  // friend lấy từ file `Chat`

    const [status, setStatus] = useState("");
    const [chatHistory, setChatHistory] = useState([]);  // lịch sử chat
    const [typedText, setTypedText] = useState('')   // văn bản vừa mới gõ
    const [heightTextInput, setHeightTextInput] = useState(0);   // xác định chiều cao của input

    const getUserID = async () => {
        let key;
        let stringUser = await AsyncStorage.getItem("user")  
        let myUserId =  JSON.parse(stringUser).userId

        if(myUserId < friend.userId) key = myUserId + friend.userId;
        else key =  friend.userId + myUserId;

        onValue(firebaseDatabaseRef(db, `conversations/${key}`), async (snapshot) => {
            if(snapshot.exists()) {
                // Lấy giá trị chọc từ db xuống
                let snapshotObject = snapshot.val();  // đối tượng
                
                // Lấy id của bản thân dựa vào 'AsyncStorage'
                let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object
                

                let updatedConversationChats = Object.keys(snapshotObject)
                    .filter(item => item.includes(myUserId+"-"+friend.userId) || item.includes(friend.userId+"-"+myUserId))  
                    .map(eachKey => {
                        let eachObject = snapshotObject[eachKey]  // lấy object (đối tượng) theo key
                        
                        // Nhân bản đối tượng eachObject, đồng thời thêm 1 thuộc tính `isMe` vào đối tượng
                        return {
                            ...eachObject,
                            isMe: eachKey.split('-')[0] === myUserId,
                            url: eachKey.split('-')[0] === myUserId ? '' : friend.url,
                        }
                    })
                    .sort((item1, item2) => - item1.timestamp + item2.timestamp)  // sắp xếp theo thứ tự tăng dần timestamp
                setChatHistory(updatedConversationChats);
            } else {
                console.log(`No data available`);
            }
        })
    }

    const getStatus = async () => {
        onValue(firebaseDatabaseRef(db, `status/${friend.userId}`), async (snapshot) => {
            if(snapshot.exists()) {
                // Lấy giá trị chọc từ db xuống
                let snapshotObject = snapshot.val();  // đối tượng
                console.log(snapshotObject["status"])
                
                setStatus(snapshotObject["status"])
            } else {
                console.log(`No data available`);
            }
        })
    }

    useEffect(() => {
        getUserID()
    }, [])

    useEffect(() => {
        getStatus()
    }, [])

    return (
        <View style={styles.screen}>

            {/*--- Header ---*/}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => {goBack()}} >
                    <Icon name="chevron-left" size={23} color={colors.marsBlack} />
                </TouchableOpacity>
                
                <Image style={styles.headerAvatar} source={{uri: friend.url}} />

                <View style={{width: Distance.screenWidth - 200, height: 45}}>
                    <Text style={{fontWeight: '700', fontSize: 18, color: colors.marsBlack}}>
                        {friend.name.length > 15 ? friend.name.substring(0, 15) + "..." : friend.name}
                    </Text>
                    <Text style={{fontWeight: '400', fontSize: 13, color: status == 'onl' ? '#2D8513' : "#6C6C6C"}}>
                        {status == 'off' || status == '' ? "Offline" : "Online"} 
                    </Text>
                </View>
            </View>

            {/* Body */}
            <FlatList
                inverted
                style={{flex: 1, backgroundColor: '#F0F0F0', paddingTop: 20}}
                data={chatHistory}
                keyExtractor={item => item.timestamp + ``}
                renderItem={({item}) => (
                    <ConversationBlocks item={item} 
                        onPress = {() => {
                            // Truyền hàm sang ConversationBlock (xác định xem tin nhắn có được bấm vào hay không)
                            let cloneChatHistory = chatHistory.map(eachChatHistory => {
                                if(item.timestamp == eachChatHistory.timestamp) {  // tìm tin nhắn vừa bấm
                                    // nhân bản eachChatHistory kèm theo isTouch bằng 'true' (lưu vào cloneChatHistory)
                                    return {
                                        ...eachChatHistory,
                                        isTouch: eachChatHistory.isTouch == undefined || eachChatHistory.isTouch == false ? true : false,
                                    }
                                }
                                return eachChatHistory;
                            })
                            setChatHistory(cloneChatHistory);  // cập nhật chatHistory
                        }}
                    />
                )}
            />

            {/*=== Text Input & Send button  */}
            <View style={[styles.bottomContainer]}>
                {/* Text input */}
                <ScrollView>
                    <TextInput 
                        style={[styles.textInput, { height: Math.max(40, heightTextInput) }]}
                        // style={styles.textInput}
                        onChangeText={(typedText) => {
                            setTypedText(typedText);
                        }}
                        value={typedText}
                        placeholder='Enter your message here!'
                        multiline={true}
                        // rows={5}
                        numberOfLines={5}
                        onContentSizeChange={(event) =>
                            setHeightTextInput(event.nativeEvent.contentSize.height)
                        }
                    />
                </ScrollView>
                
                {/* button send messenger */}
                <TouchableOpacity 
                    style={{height: 40, marginTop: 10, marginLeft: 3}}
                    // onPress={async () => {
                    //     setHeightTextInput(40)

                    //     // debugger
                    //     if(typedText.trim().length == 0) {
                    //         return
                    //     }  
                        
                    //     // Người gửi: (lấy value dựa vào key, key là user ở màn hình Wellcome)
                    //     let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                    //     let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object
                    //     let myFriendUserId = friend.userId  // lấy giá trị id của bạn bè mình đang nhắn tin

                    //     // Thông tin liên quan đến đoạn chat: 
                    //     let newMessengerObject = {
                    //         url: '',  // url ảnh của mình
                    //         showUrL: true,
                    //         // isMe: true,  // là true vì mình là người gửi
                    //         timestamp: (new Date()).getTime(),  // addHours((new Date()), 7).getTime()
                    //         messageText: typedText,
                    //     }

                    //     Keyboard.dismiss(); // ẩn Keyboard đi khi nhấn nút gửi

                    //     // save to firebase db:
                    //     // key: firebaseDatabaseRef( db, `conversations/${myUserId-myFriendUserId}`) 
                    //     firebaseSet(firebaseDatabaseRef( db, `conversations/${myUserId}-${myFriendUserId}-${newMessengerObject.timestamp}`), newMessengerObject)
                    //         .then(() => {
                    //             setTypedText("");  // khi gửi thành công thì xóa đoạn text ở trong input đi
                    //         })
                    //     }}> 
                    onPress={async () => {
                        setHeightTextInput(40)

                        // debugger
                        if(typedText.trim().length == 0) {
                            return
                        }  
                        
                        // Người gửi: (lấy value dựa vào key, key là user ở màn hình Wellcome)
                        let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                        let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object
                        let myFriendUserId = friend.userId  // lấy giá trị id của bạn bè mình đang nhắn tin

                        // Thông tin liên quan đến đoạn chat: 
                        let newMessengerObject = {
                            url: '',  // url ảnh của mình
                            showUrL: true,
                            // isMe: true,  // là true vì mình là người gửi
                            timestamp: (new Date()).getTime(),  
                            messageText: typedText,
                        }

                        Keyboard.dismiss(); // ẩn Keyboard đi khi nhấn nút gửi

                        // save to firebase db:
                        let key;
                        if(myUserId < myFriendUserId) key = myUserId + myFriendUserId;
                        else key =  myFriendUserId + myUserId;
                        console.log(">>>> check key khi thêm dữ liệu: ", key)
                        firebaseSet(firebaseDatabaseRef( db, `conversations/${key}/${myUserId}-${myFriendUserId}-${newMessengerObject.timestamp}`), newMessengerObject)
                            .then(() => {
                                setTypedText("");  // khi gửi thành công thì xóa đoạn text ở trong input đi
                            })
                        }}>

                    <Icon name="paper-plane" size={30} color={colors.primary} style={{padding: 3}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {flex: 1, backgroundColor: '#FEFEFE'},

    headerContainer: {
        height: 13*heightScreen/100, 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 10,
    },

    headerAvatar: {
        width: 45, 
        height: 45, 
        borderRadius: 50, 
        marginLeft: 20, 
        marginRight: 15
    },

    bottomContainer: {
        height: 80, 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        // flex: 1, 
        // position: 'absolute', 
        // bottom: 0, 
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 7,
        paddingBottom: 13,
        maxHeight: 150,
        // backgroundColor: 'red'
    },
    textInput: {
        // height: 30, 
        paddingLeft: 10, 
        marginTop: 10, 
        marginLeft: 15, 
        width: Distance.screenWidth - 70, 
        backgroundColor: '#F3F3F3', 
        borderRadius: 20,
        fontSize: 15
      }
})

export default Conversation;