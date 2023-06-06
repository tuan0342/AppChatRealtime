import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import Distance from '../utilies/Distance';
import images from '../constants/images';
import { auth, onAuthStateChanged, firebaseDatabaseRef, firebaseSet, db } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';  // lưu dữ liệu vào thiết bị

function Wellcome(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    useEffect(() => {

        //  - muốn biết liệu người dùng của mình hiện đang đăng nhập hay đăng xuất khỏi ứng dụng
        //  - 'onAuthStateChanged' cho phép bạn đăng ký trạng thái xác thực hiện tại của người dùng và nhận một 
        //  sự kiện bất cứ khi nào trạng thái đó thay đổi
        onAuthStateChanged(auth, (responseUser) => {
          if(responseUser) {
            console.log(">>>>> Đang đăng nhập")
            // User is signed in, see docs for a list of available properties
            
            // Tạo ra đối tượng 'user' bao gồm các trường bên dưới, lấy từ 'responseUser' của firebase
            // -> lấy đối tượng 'user' vừa tạo ra ghi vào trong firebase theo đường dẫn `users/${user.userId}`
            let user = {
                name: responseUser.name,
                userId: responseUser.uid,
                email: responseUser.email,
                emailVerified: responseUser.emailVerified,
                accessToken: responseUser.accessToken
            }
    
            // save user to local storage (file Conversation có gọi lại)
            AsyncStorage.setItem("user", JSON.stringify(user))   // key: user, value: JSON.stringify(user) 
            firebaseSet(firebaseDatabaseRef( db, `status/${responseUser.uid}`), {  
                // các giá trị lưu trong bảng
                status: "onl"
            })
    
            navigate('UITab');
          } else {
            // User is signed out
            console.log(">>>> Đã đăng xuất")
          }
        })
    })

    return(
        <View style={{flex: 1}}>
            {/* Block ảnh */}
            <View style={{height: '50%', alignItems: 'center'}}>
                <Image source={images.backgroundWellcome} style={styles.img}/>
            </View>

            {/* Block khẩu hiểu */}
            <View style={{height: '30%', alignItems: 'center', paddingTop: 20}}> 
                <Text style={{fontSize: 14, color: colors.marsBlack}}>Wellcome to</Text>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.marsBlack}}>SOCIAL NETWORK !</Text>
                <Text style={{fontSize: 14, color: colors.lightgray, marginTop: 10}}>Start to connect with everyone</Text>
            </View>

            {/* Block button */}
            <View style={{height: '20%'}}>
                <TouchableOpacity 
                    style={styles.buttonGetIn} 
                    onPress={() => {
                        navigate('Login');
                    }}
                >
                    <Icon style={{position: 'absolute', left: 10}} name="sign-in" size={25} color="black" />
                    <Text style={{ alignSelf: 'center', fontSize: 16, fontWeight: '600', color: 'black'}}>Get In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonCreateAccount}
                    onPress={() => {
                        navigate('Register')
                    }}
                >
                    <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '600', color: 'black'}}>Create an Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {width: Distance.screenWidth - 30, resizeMode: 'contain', height: '80%', marginTop: '20%'},

    buttonGetIn: {                        
        backgroundColor: colors.primary, 
        width: Distance.screenWidth - 60,
        marginLeft: 30,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10
    },

    buttonCreateAccount: {
        marginTop: 25, width: Distance.screenWidth - 200, marginLeft: 100
    },
})

export default Wellcome;