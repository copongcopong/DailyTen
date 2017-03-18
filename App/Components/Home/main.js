import React, { Component } from 'react';

import {TouchableOpacity} from 'react-native';

import { Text, Container, Header, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';


import {StackNavigator} from 'react-navigation';

import PageOne from './main-page1';
import PageTwo from './main-page2';
import MainModal from './main-modal';
import ForBaseModal from './main-modal';


import AppStore from '../../Stores/AppStoreSimple';
const Store = new AppStore({});


class MainHome extends Store.BaseComponent { // eslint-disable-line

  constructor(o,p) {
    super(o,p);

    this.Store = Store;
    this.initState = {
      ctr: 0, lists: []
    };
  }

  _goToView(id, comp) {

    const { navigate } = this.props.navigation;

    if(comp !== undefined) return navigate(id, {Component: comp, showHeader: true});

    return navigate(id);

  }

  static navigationOptions = {
    // Nav options can be defined as a function of the navigation prop:
    title: 'MainScreen',
  };

  

  render() { // eslint-disable-line

    return (
      <Container>

        <Content>



          <ListItem  onPress={() => this._goToView('PageOne')} icon>
            <Left >
              <Icon name='home'  />
            </Left>
            <Body>
              <Text>Go to PageOne</Text>

            </Body>

          </ListItem>
          <ListItem>
            <TouchableOpacity onPress={() => this._goToView('PageTwo')}>
              <Icon name="plane" /><Text>Page with Data from PouchDB</Text>
            </TouchableOpacity>

          </ListItem>

          <ListItem>
            <TouchableOpacity onPress={() => { this._goToView('MainModal') } }>
              <Text>Show Main Modal</Text>
            </TouchableOpacity>
          </ListItem>

          <ListItem>
            <TouchableOpacity onPress={() => { this._goToView('Setting') } }>
              <Text>Go to Setting (Tab)</Text>
            </TouchableOpacity>
          </ListItem>

          <ListItem>
            <TouchableOpacity onPress={() => { this._goToView('BaseModal', ForBaseModal) } }>
              <Text>Go to BaseModal</Text>
            </TouchableOpacity>
          </ListItem>
          <ListItem>
            <TouchableOpacity onPress={() => this._goToView('page3')}>
              <Text>None existent page</Text>
            </TouchableOpacity>
          </ListItem>

          
          

        </Content>
      </Container>
    );
  }
}
//);

const MainScreen = StackNavigator({
  Home: { screen: MainHome},
  PageOne: {screen: PageOne},
  PageTwo: {screen: PageTwo},
  MainModal: {screen: MainModal}
});

export default MainScreen;
