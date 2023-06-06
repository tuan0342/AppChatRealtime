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
import { 
    auth, onAuthStateChanged, firebaseDatabaseRef, 
    firebaseSet, db, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, sendEmailVerification 
  } from '../firebase/firebase';
  import AsyncStorage from '@react-native-async-storage/async-storage';  // lưu dữ liệu vào thiết bị

const Login = props => {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    // states for validating
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    // states to store email/password
    const [email, setEmail] = useState('anhphan0110@gmail.com');
    const [password, setPassword] = useState('123455');

    // check validation email and password
    const isValidationOK = () => {
        return (
            email.length > 0 &&
            password.length > 0 &&
            errorEmail.length == 0 &&
            errorPassword.length == 0 
        );
    };

    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0} style={{flex: 1, backgroundColor: colors.background}}>
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

                {/* Login text */}
                <View style={styles.textLoginView}>
                    <Text style={{fontSize: 26,  fontWeight: 'bold', color: colors.marsBlack}}>Login</Text>
                    <Text style={{fontSize: 14, color: '#3D3D3D', marginTop: 5}}>Please sign in to continue.</Text>
                </View>

                {/* Nhập dữ liệu */}
                <View style={styles.containerInputView}>
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
                        // value={email}
                        style={styles.textinput}
                        value={email}
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
                        // value={password}
                        placeholder='Enter your password!' 
                        placeholderTextColor={'#A3A3A3'}
                        secureTextEntry={true}
                        style={styles.textinput}
                        value={password}
                    />
                </View>

                {/* forget password */}
                <View style={styles.buttonForgetPasswordView}>
                    <TouchableOpacity style={{width: 120, alignItems: 'center'}}>
                        <Text style={{fontSize: 14, fontWeight: '600', color: colors.marsBlack}}>Forgot Password</Text>
                    </TouchableOpacity>
                </View>

                {/* các button login, register */}
                <View style={styles.buttonContainerView}>
                    {/* Login */}
                    <TouchableOpacity 
                        style={[styles.buttonLogin, {backgroundColor: isValidationOK() == true ? colors.primary : colors.inactive}]}
                        disabled={isValidationOK() == false}
                        onPress={() => {
                            // lưu thông tin đăng nhập vào database
                            signInWithEmailAndPassword(auth, email, password)
                                .then((userCredential) => {
                                    // Signed in 
                                    const user = userCredential.user;  // tạo user
                                    
                                    navigate('UITab')  // đăng kí thành công thì chuyển sang UITabs
                                })
                                .catch((error) => {
                                    alert(`Email or password is wrong`)
                                });
                            }}
                    >
                        <Icon style={{position: 'absolute', left: 10}} name="sign-in-alt" size={25} color={isValidationOK() == true ? 'black' : '#4D4D4D'} />
                        <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '600', color: isValidationOK() == true ? 'black' : '#4D4D4D'}}>Get In</Text>
                    </TouchableOpacity>
                    
                    {/* Register */}
                    <TouchableOpacity 
                        onPress={() => {
                            navigate('Register');
                        }}
                        style={styles.buttonCreateAccount}
                    >
                        <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>Create an Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    // Các container:
    iconBackView: {flex: 10, height: Distance.screenHeight*10/100, justifyContent: 'center'},

    textLoginView: {flex: 15, height: Distance.screenHeight*15/100, marginLeft: 30, justifyContent: 'center'},

    containerInputView: {flex: 33, height: Distance.screenHeight*33/100, marginLeft: 30, marginRight: 30},

    buttonForgetPasswordView: {flex: 22, height: Distance.screenHeight*22/100, marginLeft: 30, marginRight: 30, alignItems: 'flex-end'},

    buttonContainerView: {flex: 20, height: Distance.screenHeight*20/100, marginLeft: 30, marginRight: 30, alignItems: 'center'},

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

export default Login;