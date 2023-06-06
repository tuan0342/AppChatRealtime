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

const screenWidth = Distance.screenWidth - 16;

function ConversationBlocks(props) {
    const onPress = props.onPress;
    const {url, showUrL, isMe, timestamp, messageText, isTouch} = props.item;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={{flexDirection: 'row', flex: 1}}>
                {isMe === false && showUrL === true ? (
                <Image style={styles.avatarImg} source={{uri: url}} />
                ) : (
                <View style={{width: 50}} />
                )}
                
                <View style={{ maxWidth: (screenWidth*3)/4, marginLeft: isMe === true ? 'auto' : 0, minWidth: 80 }}>
                    <Text style={{    
                        minHeight: 40,
                        padding: 10,
                        borderRadius: 13,
                        fontSize: 15,
                        color: isMe == false ? colors.lighBlack : '#fbe9ea',  // F7F7F7
                        backgroundColor: isMe == false ? '#FEFEFE' : colors.primary  // 53A5EE
                    }}>{messageText}</Text>

                    {isTouch == true ? (
                        <View style={{height: 25, marginLeft: 10}}>
                            <Text>{convertTimeStampToDate(timestamp)}</Text>
                        </View> 
                    ) :
                        <View></View>
                    }
                </View>
            </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 5,
    },
  
    avatarImg: {
      width: 40,
      height: 40,
      borderRadius: 50,
      // alignSelf: 'center',
      alignSelf: 'flex-end',
      marginHorizontal: 5,
      marginBottom: 2,
    },
});
  

export default ConversationBlocks;