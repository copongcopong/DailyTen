import React, { Component } from 'react';

import {TouchableOpacity} from 'react-native';

import { Text, Container, Header, Title, Content, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';


export default class MainModal extends Component { // eslint-disable-line


  _goToView(id) {

    const { navigate } = this.props.navigation;

    navigate(id);

  }

  static navigationOptions = {
    // Nav options can be defined as a function of the navigation prop:
    title: 'Modal',
  };

  render() { // eslint-disable-line

    return (
      <Container>

        <Content padder>
        <ListItem>
          <TouchableOpacity onPress={() => this._goToView('PageTwo')}>
            <Text>Go to PageTwo</Text>
          </TouchableOpacity>

        </ListItem>
        <ListItem>
          <TouchableOpacity onPress={() => this._goToView('page3')}>
            <Text>None existent page</Text>
          </TouchableOpacity>
        </ListItem>
        <ListItem>
          <TouchableOpacity onPress={() => {console.log(this.props.navstore); this.props.appstore.showModal() } }>
            <Text>Modal global</Text>
          </TouchableOpacity>
        </ListItem>
        </Content>
      </Container>
    );
  }
}
