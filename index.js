/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Login, Register, Wellcome, Setting, Upload, Chats, Conversation} from './screens/indexs'
import MyApp from './navigation/MyApp';

AppRegistry.registerComponent(appName, () => () => <MyApp />);
