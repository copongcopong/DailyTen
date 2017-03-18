import React, { Component } from 'react';

import {TouchableOpacity} from 'react-native';

import { Text, Container, Header, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';


import {StackNavigator} from 'react-navigation';

import PageOne from './main-page1';
import PageTwo from './main-page2';
import MainModal from './main-modal';
import ForBaseModal from './main-modal';


import Store from '../../Stores/AppStore';

const DB = Store.get('_appdb');

DB.db.changes({since: 'now', include_docs: true, live: true})
  .on('change', function(up){
    console.log('DB UP', up);
  });

Store.set('hello', 'WORLD');

console.log('Store', Store, Store.get(''), global, process);

//const MainHome = observer(
  class MainHome extends Component { // eslint-disable-line

  constructor(o,p) {
    super(o,p);

    //this.setState({Store: Store});
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

  componentWillMount() {

    var this_ = this;
    this.setState({Store: Store, StoreData: Store.get('')});
    Store.observe('*', function(newd, old){
      this_.setState({StoreData: newd});
      console.log("UUUU");
    });

    setTimeout(function() {
      console.log('STOREEE', Store.get(''));
      Store.set('hello', 'BOOOOO');
    }, 4000);

  }

  /*shouldComponentUpdate(nextProps, nextState) {
    //return Store.get('hello') !== this.state.Store.get('hello');

    //return nextState.rData !== this.state.rData && R.get('') !== this.state.R.get('');
  }*/

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

          <ListItem>
            <TouchableOpacity onPress={() => this.state.Store.set('hello', 'YYYYY')}>
              <Text>Change Store.hello </Text>
              <Text>{this.state.Store.get('hello')}</Text>
            </TouchableOpacity>
          </ListItem>

          <ListItem>
            <TouchableOpacity onPress={() => DB.add({time: new Date(), type: 'mocks', rand: Math.random() }).then(() => DB.getMocks() ) }>
              <Text>{this.state.Store.get('ctr')} Add To DB {this.state.Store.get('hello')}</Text>
            </TouchableOpacity>
          </ListItem>

          <ListItem>
            <TouchableOpacity onPress={() => DB.reset()}>
              <Text>Reset PouchDB </Text>

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
