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
import colors from '../constants/colors';
import Distance from '../utilies/Distance';
import images from '../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDatabaseRef, db, onValue, update } from '../firebase/firebase';
import { storage, storageRef, getDownloadURL, uploadBytes } from '../firebase/firebase'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

function Profile(props) {
    // navigation
    const {navigation, route} = props;
    // function of navigate to/back
    const {navigate, goBack} = navigation;

    const [id, setId] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [avatar, setAvatar] = useState(undefined);

    
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
                setAvatar(response.assets[0].uri);
                let blob = await fetch(response.assets[0].uri).then(r => r.blob());

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
                        }, 5000)
                    })
                    .catch((error) => {
                        alert(`Can not register, error: ${error.message}`)
                    });
            }
        })
    }


    useEffect(() => {
        const getAvatarFromDB = async () => {
            // Lấy id của bản thân dựa vào 'AsyncStorage'
            let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
            let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object

            getDownloadURL(storageRef(storage, 'images/' + myUserId))
                .then((url) => {
                    setAvatar(url);
                })
                .catch((e) => console.log('Errors while downloading => ', e));
        }
        getAvatarFromDB()
            .catch(console.error)

        // Lấy dữ liệu (bảng  `users`) từ firebase xuống - Reload khi có sự thay đổi của database
        onValue(firebaseDatabaseRef(db, 'users'), async (snapshot) => {
            // debugger
            if(snapshot.exists()) {
                // Lấy giá trị chọc từ db xuống
                let snapshotObject = snapshot.val();  // đối tượng

                // Lấy id của bản thân dựa vào 'AsyncStorage'
                let stringUser = await AsyncStorage.getItem("user")  // được lưu ở dạng string (lấy dữ liệu này từ AsyncStorage đã lưu khi đăng nhập)
                let myUserId =  JSON.parse(stringUser).userId  // chuyển stringUser sang object
    
                // Lấy thông tin bản thân trên database
                Object.keys(snapshotObject)
                  .filter(eachKey => eachKey == myUserId)  // lọc (chỉ lấy những thằng có userId khác myUserId)
                  .map(eachKey => { // lấy theo key (userId) rồi duyệt theo từng key
                    let eachObject = snapshotObject[eachKey]  // lấy object (đối tượng) theo key
                    setName(eachObject.name)
                    setEmail(eachObject.email)
                    setId(eachObject.userId)            
                })
                // debugger
            } else {
                console.log(`No data available`);
            }
        })
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 30}}>
            {/* Header */}
            <View style={styles.iconBackView}>
                <TouchableOpacity style={{width: 24}} onPress={() => { goBack() }}>
                    <Icon name="chevron-left" size={23} color={colors.marsBlack} />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarView}>
                <View style={{width: 90, height: 90, borderRadius: 50, flexDirection: 'row'}}>
                    {avatar !== undefined 
                        ? <Image source={{ uri: avatar }} style={{width: 90, height: 90, borderRadius: 50}}/> 
                        : <View style={{width: 90, height: 90}}></View>} 
                    <TouchableOpacity 
                        style={styles.avatarViewEdit}
                        onPress={() => { ImageFromLibrary() }}
                    >
                        <Icon name="camera" size={15} color={colors.marsBlack} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.avatarViewText}> {name} </Text>
            </View>

            {/* Email */}
            <View style={styles.emailView}>
                <Icon name="envelope" size={20} color={colors.lighBlack} />
                <Text style={{marginLeft: 20, color: colors.lighBlack, fontSize: 15}}>{email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconBackView: {height: Distance.screenHeight*10/100, justifyContent: 'center'},

    avatarView: {
        height: Distance.screenHeight*18/100, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    avatarViewText: {
        marginLeft: 20, 
        fontSize: 22, 
        width: Distance.screenWidth - 170,
        color: '#231717',
        fontWeight: '700'
    },
    avatarViewEdit: {
        height: 30, 
        width: 30, 
        backgroundColor: '#E2E2E2', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 50,
        marginLeft: 'auto',
        marginTop: 'auto'
    },

    emailView: {
        height: Distance.screenHeight*25/100,
        flexDirection: 'row',
        marginTop: 10
    }
})

export default Profile;