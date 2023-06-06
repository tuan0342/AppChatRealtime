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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {storage, storageRef, uploadBytes, getDownloadURL } from '../firebase/firebase'
import { firebaseDatabaseRef, firebaseSet, db, update } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Upload(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    const [image, setImage] = useState(null);
    const [blob, setBlob] = useState(null);

    const ImageFromLibrary =  () => {
        let options = {
            mediaType: 'photo',
        }
        launchImageLibrary(options, async response => {
            if(response.didCancel) {
                console.log('User cancelled image picker');
            } else if(response.errorCode) {
                console.log('ImagePicker Error: ', response.errorCode);
            } else {
                setImage(response.assets[0].uri);
                let blob = await fetch(response.assets[0].uri).then(r => r.blob());
                setBlob(blob);
            }
        })
    }

    const ImageFromCamera = () => {
        let options = {
            mediaType: 'photo',
        }
        launchCamera(options, async response => {
            if(response.didCancel) {
                console.log('User cancelled image picker');
            } else if(response.errorCode) {
                console.log('ImagePicker Error: ', response.errorCode);
            } else {
                setImage(response.assets[0].uri);
                let blob = await fetch(response.assets[0].uri).then(r => r.blob());
                setBlob(blob);
            }
        })
    }


    return(
        <View style={{flex: 1}}>
            {/* block button "bỏ qua" (Skip) */}
            <View style={{height: '10%', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.buttonSkip} 
                    onPress={async () => {
                        // Lấy id của bản thân dựa vào 'AsyncStorage'
                        let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                        let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object

                        // Create a reference to 'images/mountains.jpg'
                        const imagesRef = storageRef(storage, `images/${myUserId}`);

                        let blob = await fetch('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg').then(r => r.blob());
                        setBlob(blob);

                        const metadata = {
                            contentType: 'image/jpeg',
                        };

                        // 'file' comes from the Blob or File API
                        uploadBytes(imagesRef, blob, metadata)
                            .then((snapshot) => {
                                console.log('Uploaded a blob or file!');

                                setTimeout(() => {
                                    getDownloadURL(storageRef(storage, 'images/' + myUserId))  // download ảnh vừa upload
                                        .then((url) => {
                                            // cập nhật realtime user
                                            update(firebaseDatabaseRef( db, `users/${myUserId}`), {  
                                                avatar: url,
                                            })
                                        })
                                        .catch((e) => console.log('Errors while downloading => ', e));
                                }, 2000)

                                navigate('UITab');
                            })
                            .catch((error) => {
                                alert(`Can not register, error: ${error.message}`)
                            });
                            
                    }}>
                    <Text style={{fontWeight: '900', fontSize: 18, color: colors.marsBlack}}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* block show image */}
            <View style={{height: '45%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.textHeader}>Avatar</Text>
                {image === null ? (
                    <Image source={images.avatarDefault} style={styles.image}/>
                ) : (
                    <Image source={{ uri: image }} style={styles.image}/>
                )}
                
            </View>

            {/* block button */}
            <View style={{height: '30%', alignItems: 'center'}}> 
                {/* button camera */}
                <TouchableOpacity onPress={() => {ImageFromCamera() }} style={[styles.button, {backgroundColor: colors.primary}]}>
                    <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '800', color: 'white'}}>
                        Camera
                    </Text>
                </TouchableOpacity>
                    
                {/* button upload image */}
                <TouchableOpacity onPress={() => {ImageFromLibrary() }} style={[styles.button, {backgroundColor: colors.primary}]}>
                    <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '800', color: 'white'}}>
                        Upload from Device
                    </Text>
                </TouchableOpacity>
                
                {/* button set as avatar */}
                <TouchableOpacity 
                    disabled={image !== null ? false : true}
                    style={[styles.button, {backgroundColor: image !== null ? colors.primary : colors.inactive}]}
                    onPress={async () => {
                                                
                        // Lấy id của bản thân dựa vào 'AsyncStorage'
                        let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                        let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object

                        // Create a reference to 'images/mountains.jpg'
                        const imagesRef = storageRef(storage, `images/${myUserId}`);

                        // 'file' comes from the Blob or File API
                        uploadBytes(imagesRef, blob)
                            .then((snapshot) => {
                                console.log('Uploaded a blob or file!');

                                setTimeout(() => {
                                    getDownloadURL(storageRef(storage, 'images/' + myUserId))  // download ảnh vừa upload
                                        .then((url) => {
                                            // cập nhật realtime user
                                            update(firebaseDatabaseRef( db, `users/${myUserId}`), {  
                                                avatar: url,
                                            })
                                        })
                                        .catch((e) => console.log('Errors while downloading => ', e));
                                }, 2000)
                                
                                navigate('UITab');
                            })
                            .catch((error) => {
                                alert(`Can not register, error: ${error.message}`)
                            });
                        
                    }}
                >
                    <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '800', color: 'white'}}>
                        Set as Avatar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonSkip: {
        height: 30, 
        width: 80, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        right: 10
    },

    textHeader: {
        marginBottom: 20, 
        fontSize: 24, 
        fontWeight: '800', 
        color: '#4C3D3D'
    },

    image: {
        height: 200, 
        width: 200, 
        borderRadius: 100, 
        borderWidth: 2, 
        borderColor: '#4C3D3D',
    },

    button: {
        width: Distance.screenWidth - 120,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        marginTop: 10
    },
})

export default Upload;