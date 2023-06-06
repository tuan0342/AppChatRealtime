import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors';
import Distance from '../utilies/Distance';
import {isValidEmail, isValidPassword} from '../utilies/Validation'
import images from '../constants/images';
import { auth, onAuthStateChanged, firebaseDatabaseRef, firebaseSet, db, createUserWithEmailAndPassword, sendEmailVerification } from '../firebase/firebase';

function Register(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    // states for validating
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    // states to store email/password
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('123455');

    // check validation email and password
    const isValidationOK = () => {
        return (
            name.length > 0 &&
            email.length > 0 &&
            password.length > 0 &&
            errorEmail.length == 0 &&
            errorPassword.length == 0 
        );
    };

    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0} style={{flex: 1,}}>
            <ScrollView>
                {/* Icon back */}
                <View style={styles.iconBackView}>
                    <TouchableOpacity 
                        style={{width: 24, marginLeft: 30}}
                        onPress={() => {
                            goBack();
                        }}
                    >
                        <Icon name="chevron-left" size={23} color={colors.marsBlack} />
                    </TouchableOpacity>
                </View>

                {/* Register text */}
                <View style={styles.textRegisterView}>
                    <Text style={{fontSize: 26,  fontWeight: 'bold', color: colors.marsBlack}}>Register Account</Text>
                    <Text style={{fontSize: 14, color: '#3D3D3D', marginTop: 5}}>Please register account to continue.</Text>
                </View>

                {/* Nhập dữ liệu */}
                <View style={styles.containerInputView}>
                    {/* Name */}
                    <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="user" size={17} color={colors.marsBlack} />
                        <Text style={{fontSize: 15, color: colors.marsBlack}}>   Name</Text>
                    </View>
                    <TextInput 
                        onChangeText={text => {
                            setName(text);
                        }}
                        placeholder='Enter your name!' 
                        placeholderTextColor={'#A3A3A3'}
                        style={styles.textinput}
                    />

                    {/* Email */}
                    <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="envelope" size={17} color={colors.marsBlack} />
                        <Text style={{fontSize: 15, color: colors.marsBlack}}>   Email</Text>
                    </View>
                    <TextInput 
                        onChangeText={text => {
                            if (isValidEmail(text) == false) {
                                setErrorEmail('Email is not correct format');
                            } else {
                                setErrorEmail('');
                                setEmail(text);
                            }
                        }}
                        placeholder='Enter your email!' 
                        placeholderTextColor={'#A3A3A3'}
                        style={styles.textinput}
                        // value={email}
                    />

                    {/* Password */}
                    <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={images.passwordIcon} style={{height: 18}}/>
                        <Text style={{fontSize: 15, color: colors.marsBlack}}>   Password</Text>
                    </View>
                    <TextInput 
                        onChangeText={text => {
                            if(isValidPassword(text) == false) {
                                setErrorPassword('Password is not correct format');
                            } else {
                                setErrorPassword('');
                                setPassword(text);
                            }
                        }}
                        value={password}
                        placeholder='Enter your password!' 
                        placeholderTextColor={'#A3A3A3'}
                        secureTextEntry={true}
                        style={styles.textinput}
                    />
                </View>

                {/* Thông báo đồng ý điều khoản */}
                <View style={styles.buttonForgetPasswordView}>
                    <Text style={{fontSize: 14, fontWeight: '400', color: colors.marsBlack}}>
                    By signing up you agree with our 
                    </Text> 
                    <Text style={{fontSize: 14, fontWeight: '600', color: colors.marsBlack}}>terms and conditions</Text>
                </View>

                {/* button Create account  */}
                <View style={styles.buttonContainerView}>
                    <TouchableOpacity 
                        style={[styles.buttonLogin, {backgroundColor: isValidationOK() == true ? colors.primary : colors.inactive}]}
                        disabled={isValidationOK() == false}
                        onPress={() => {
                            createUserWithEmailAndPassword(auth, email, password)
                                .then((userCredential) => {
                                    // Signed in 
                                    const user = userCredential.user;  // tạo user
                                    
                                    // gửi verifycation email
                                    sendEmailVerification(user).then(() => {
                                        console.log(`Sent email verification`)
                                    })

                                    // cập nhật realtime user
                                    firebaseSet(firebaseDatabaseRef( db, `users/${user.uid}`), {  
                                        // các giá trị lưu trong bảng
                                        name: name,
                                        avatar: "",
                                        userId: user.uid,
                                        email: user.email,
                                        emailVerified: user.emailVerified,
                                        accessToken: user.accessToken  //mã sinh ra ngẫu nhiên được sử dụng bí mật cho mỗi người dùng
                                    })

                                    navigate('Upload');
                                })
                                .catch(error=>{
                                    alert(`Can not register, error: ${error.message}`)
                                })
                        }}
                    >
                        <Icon 
                            style={{position: 'absolute', left: 10}} 
                            name="user-plus" size={25} 
                            color={isValidationOK() == true ? 'black' : '#4D4D4D'} 
                        />
                        <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '600', 
                                color: isValidationOK() == true ? 'black' : '#4D4D4D'}}>
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  // Các container:
  iconBackView: {flex: 10, height: Distance.screenHeight*10/100, justifyContent: 'center'},

  textRegisterView: {flex: 15, height: Distance.screenHeight*15/100, marginLeft: 30, justifyContent: 'center'},

  containerInputView: {flex: 50, height: Distance.screenHeight*50/100, marginLeft: 30, marginRight: 30},

  buttonForgetPasswordView: {flex: 10, height: Distance.screenHeight*10/100, marginLeft: 30, marginRight: 30, alignItems: 'center', justifyContent: 'flex-end'},

  buttonContainerView: {flex: 15, height: Distance.screenHeight*15/100, marginLeft: 30, marginRight: 30, alignItems: 'center', justifyContent: 'center'},

  // Các element:
  textinput: {
      height: 50, 
      borderColor: '#A3A3A3', 
      borderWidth: 1, 
      width: Distance.screenWidth-60,
      borderRadius: 10,
      marginTop: 10,
      paddingHorizontal: 20
  },

  buttonLogin: {
      width: Distance.screenWidth - 60,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 10
  },

  buttonCreateAccount: {
      marginTop: 25, 
      width: 150,
      alignItems: 'center'
  },
})


export default Register;