import React, {Component, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-navigation';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Wellcome, Login, Register, Upload } from '../screens/indexs';
import UITab from './UITab';
import { Conversation } from '../screens/indexs';

const Stack = createNativeStackNavigator();

function MyApp(props) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Wellcome"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={'Wellcome'} component={Wellcome} />
          <Stack.Screen name={'Login'} component={Login} />
          <Stack.Screen name={'Register'} component={Register} />
          <Stack.Screen name={'Upload'} component={Upload} />
          <Stack.Screen name={'UITab'} component={UITab} />
          <Stack.Screen name={'Conversation'} component={Conversation} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default MyApp;