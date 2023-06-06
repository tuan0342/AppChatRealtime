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
import { convertTimeStampToDate } from '../../utilies/DateTime';

const ChatBlock = props => { 
    const {url, name, lastMessage, numberOfUnreadMessage, lastTimestamp} = props.user;
    const onPress = props.onPress;

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            {/* avatar */}
            <Image style={{ width: 60, height: 60, borderRadius: 50, marginHorizontal: 10}} 
                source={{uri: url}} />

            {/* name and last message */}
            <View style={{width: Distance.screenWidth - 210, height: 60}}>
                <Text style={{fontSize: 16, color: '#414141', fontWeight: 'bold', marginTop: 5}}>
                    {name.length > 15 ? name.substring(0, 15) + "...": name}
                </Text>
                <Text style={{fontSize: 14, color: '#858585', marginTop: 0}}>
                    {lastMessage.length > 22 ? lastMessage.substring(0, 22) + "...": lastMessage}
                </Text>
            </View>

            <View style={{height: 60, marginLeft: 'auto', right: 15}}>
                <Text style={{color: '#8A8A8A', fontSize: 12, marginLeft: 5, marginTop: 5, marginLeft: 'auto'}}>
                    {convertTimeStampToDate(lastTimestamp).substring(0, 5)}
                </Text>
                <Text style={{color: '#8A8A8A', fontSize: 12, marginLeft: 5, marginTop: 5, marginLeft: 'auto'}}>
                    {convertTimeStampToDate(lastTimestamp).substring(7, 17)}
                </Text>
                {/* {numberOfUnreadMessage == 0 
                    ? ""
                    : <View style={{backgroundColor: colors.primary, marginTop: 5, borderRadius: 50, height: 25, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 'auto'}}>
                        <Text style={{fontSize: 13, color: '#F1F1F1'}}>
                            {numberOfUnreadMessage > 99 ? '99+' : numberOfUnreadMessage}
                        </Text>
                    </View>
                } */}
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 80, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: 20, 
        marginBottom: 10
    },
})

export default ChatBlock;
