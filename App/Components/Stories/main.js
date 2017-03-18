import React, { Component } from 'react';

import {TouchableOpacity} from 'react-native';

import { Text, Container, Header, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

class MainStoriesPage extends Component {

static navigationOptions = {
    title: "Stories"
  }

  constructor(props) {
    super(props);
  }

  render() {

    const {navigate} = this.props.navigation;

    return (
      <Container>


        <Content padder>

        <ListItem>
          <TouchableOpacity onPress={() => {navigate('StoriesScreen1')}}>
              <Text>Screen1</Text>
          </TouchableOpacity>
        </ListItem>
        <ListItem>
          <TouchableOpacity onPress={() => {navigate('StoriesScreen2')}}>
              <Text>Screen2</Text>
          </TouchableOpacity>
        </ListItem>
        <ListItem>
          <TouchableOpacity onPress={() => {navigate('StoriesScreen3')}}>
              <Text>Screen3</Text>
          </TouchableOpacity>
        </ListItem>

       <ListItem onPress={() => {navigate('StoriesScreen1')}}>
         <Text>SettingsScreen4</Text>
        </ListItem>

        </Content>
      </Container>
    );
  }
}
export default MainStoriesPage;
