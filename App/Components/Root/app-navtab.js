import React, { Component } from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon, View, Text } from 'native-base';
import MainScreen from '../Home/main';
import SettingsScreen from '../Settings/index';
import StoriesScreen from '../Stories/index';
import MapScreen from '../Maps/map';
import RedditScreen from '../Reddit/main';

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
  Setting: {screen: SettingsScreen, path: '/settings',
    navigationOptions: {
      tabBar: () => ({
        label: 'Setting',
        icon: ({color, focused}) => (
          <Icon name='ios-cog' active={focused} />
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
  },
  Reddit: {screen: RedditScreen, path: '/reddit',
    navigationOptions: {
      tabBar: () => ({
        label: 'Reddit',
        icon: ({color, focused}) => (
          <Icon name='ios-star' active={focused} />
        )
      })
    }
  },
  Map: {screen: MapScreen, path: '/map',
    navigationOptions: {
      tabBar: () => ({
        label: 'Map',
        icon: ({color, focused}) => (
          <Icon name='ios-map' active={focused} />
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
