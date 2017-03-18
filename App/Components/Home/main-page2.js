import React, { Component } from 'react';

import {TouchableOpacity} from 'react-native';

import { Text, Container, Header, Title, Content, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';


const _ = require('lodash');

export default class MainPage2 extends Component { // eslint-disable-line

  componentWillMount() {
    
    this.setState({dataLoaded: false});

  }

  componentWillUnmount() {
    console.log("UNMOUNTING MainPage2");
  }

  _goToView(id) {

    const { navigate } = this.props.navigation;

    navigate(id);

  }

  static navigationOptions = {
    // Nav options can be defined as a function of the navigation prop:
    title: 'MainPage2',
  };

  render() {

    if(this.state.dataLoaded === false) {

      return (
        <Container>

          <Content padder>



          <ListItem>
              <Text>Loading</Text>

          </ListItem>

          </Content>
        </Container>
      )

      } else if(_.isEmpty(this.state.dataLoaded)) {
        return (
          <Container>

            <Content padder>

            <ListItem>
                <Text>No data found</Text>

            </ListItem>

            </Content>
          </Container>
        );
      } else {


    return (
      <Container>

        <Content padder>

          {this.state.dataLoaded.map((e) => { return(
            <ListItem key={e._id}>
                <Text>{e.time}</Text>
            </ListItem>
          )})}

        </Content>
      </Container>
    );
  }
  }
}
