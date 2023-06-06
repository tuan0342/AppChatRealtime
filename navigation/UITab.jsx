import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Setting, Chats, Profile} from '../screens/indexs'

const Tab = createBottomTabNavigator();

const screenOption = ({route}) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primary,  // 
    tabBarInactiveTintColor: '#989898', // 
    tabBarStyle: {
        height: 65,
        paddingHorizontal: 5,
        paddingTop: 0,
        paddingBottom: 5,
        backgroundColor: 'white',
    },
    tabBarIcon: ({focused, color, size}) => {
        let iconName;
    
        if (route.name === 'Chats') {
            iconName = 'comment';
        }  else if (route.name === 'Setting') {
            iconName = 'cog';
        }  else if (route.name === 'Profile') {
            iconName = 'user';
        } 
    
        // You can return any component that you like here!
        return (
            <Icon name={iconName} size={27} color={focused ? colors.primary : '#989898'} />
        );
    },
});

function UITab(props){
    return (
        <Tab.Navigator screenOptions={screenOption}>
            <Tab.Screen
                name={'Chats'}
                component={Chats}
                options={{tabBarLabel: 'Messenger'}}
            />
            <Tab.Screen
                name={'Profile'}
                component={Profile}
                options={{tabBarLabel: 'Profile'}}
            />
            <Tab.Screen
                name={'Setting'}
                component={Setting}
                options={{tabBarLabel: 'Settings'}}
            />
        </Tab.Navigator>
    )
}

export default UITab;