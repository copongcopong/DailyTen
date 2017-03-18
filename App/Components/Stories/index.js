import React, { Component } from 'react';

import { Text, Container, Header, Title, Content, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

import {StackNavigator} from 'react-navigation';
import Store from '../../Stores/AppStoreSimple';

import Screen1 from './screen1';
import Screen2 from './screen2';
import Screen3 from './screen3';
//import Screen4 from './screen4';
import Main from './main';

const Screens = StackNavigator({
  StoriesMain: { screen: Main},
  StoriesScreen1: {screen: Screen1},
  StoriesScreen2: {screen: Screen2},
  StoriesScreen3: {screen: Screen3},
  //StoriesScreen4: {screen: Screen4}
});

export default Screens;
