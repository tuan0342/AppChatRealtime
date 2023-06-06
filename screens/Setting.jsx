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
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import Distance from '../utilies/Distance';
import images from '../constants/images';
import { auth, signOut, firebaseSet, firebaseDatabaseRef, db } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';  // lưu dữ liệu vào thiết bị

function Setting(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    return(
        <View style={{flex: 1, paddingHorizontal: 30, backgroundColor: colors.background}}>
            {/* Icon back */}
            <View style={styles.iconBackView}>
                <TouchableOpacity style={{width: 24}} onPress={() => {goBack()}}>
                    <Icon name="chevron-left" size={23} color={colors.marsBlack} />
                </TouchableOpacity>
            </View>

            {/* Setting text */}
            <View style={styles.textSettingView}>
                <Text style={{fontSize: 30, marginTop: 15, fontWeight: 'bold', color: colors.marsBlack}}>Settings</Text>
            </View>

            {/* Block 'Settings' */}
            <TouchableOpacity style={styles.bottonSelectView}>
                <Icon style={{}} 
                    name="cog" size={25} color={'#6A6A6A'} />
                <Text style={{marginLeft: 10, fontSize: 18, color: '#6A6A6A'}}>Settings</Text>
            </TouchableOpacity>

            {/* Block 'Support Center' */}
            <TouchableOpacity style={styles.bottonSelectView}>
                <Icon style={{}} 
                    name="question-circle" size={25} color={'#6A6A6A'} />
                <Text style={{marginLeft: 10, fontSize: 18, color: '#6A6A6A'}}>Support Center</Text>
            </TouchableOpacity>

            {/* Block 'Login out' */}
            <TouchableOpacity 
                style={styles.bottonSelectView}
                onPress={() => {
                    signOut(auth)
                        .then( async () => {
                            console.log("----------- Đăng xuất rồi nhé --------------")

                            // Lấy id của bản thân dựa vào 'AsyncStorage'
                            let stringUser = await AsyncStorage.getItem("user")  
                            let myUserId =  JSON.parse(stringUser).userId
                            // cập nhật realtime user
                            firebaseSet(firebaseDatabaseRef( db, `status/${myUserId}`), {  
                                // các giá trị lưu trong bảng
                                status: "off"
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    navigate('Wellcome');
                }}
            >
                <Icon style={{}} 
                    name="sign-out-alt" size={25} color={'#6A6A6A'} />
                <Text style={{marginLeft: 10, fontSize: 18, color: '#6A6A6A'}}>Login out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    iconBackView: {height: Distance.screenHeight*10/100, justifyContent: 'center'},

    textSettingView: {height: Distance.screenHeight*15/100},

    bottonSelectView: {                
        flexDirection:'row', 
        height: Distance.screenHeight*7/100, 
        alignItems: 'center',
        width: Distance.screenWidth-60,
        marginBottom: 10
    },
})

export default Setting;