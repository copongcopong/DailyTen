import React, { Component } from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon, View, Text } from 'native-base';
import MainScreen from '../Home/main';
import StoriesScreen from '../Stories/index';

import BaseModal from './base-modal';

const AppTab = TabNavigator({
  Home: { screen: MainScreen, path: '/',
    navigationOptions: {
      tabBar: () => ({
        label: 'Home',
        icon: ({color, focused}) => (
          <Icon name='ios-home' active={focused} />
        )
      })
    }
  },
  Stories: {screen: StoriesScreen, path: '/stories',
    navigationOptions: {
      tabBar: () => ({
        label: 'Stories',
        icon: ({color, focused}) => (
          <Icon name='ios-man' active={focused} />
        )
      })
    }
  }
});

const App = StackNavigator({
  Main: {screen: AppTab},
  BaseModal: {screen: BaseModal}
}, {headerMode: 'none', 'mode': 'modal'});

export default App;
