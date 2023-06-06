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

function ChatSearch(props) {
    const {url, name, lastMessage, numberOfUnreadMessage} = props.user
    const onPress = props.onPress;

    return(
        <TouchableOpacity style={styles.container} 
            onPress={onPress}>
            <Image style={{ width: 45, height: 45, borderRadius: 50, marginHorizontal: 10}} 
                  source={{uri: url}} />

            <Text style={{color: '#121212', fontSize: 14 }}>
                {name.length > 20 ? name.substring(0, 20) + "..." : name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 65, 
        backgroundColor: '#EDEDED', 
        borderRadius: 5, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
        flexDirection: 'row',
        marginHorizontal: 20
    },
})

export default ChatSearch;