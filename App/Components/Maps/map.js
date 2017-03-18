import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import { Text, Container, Header, Title, Content, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';


const styles = StyleSheet.create({
  floater: {
    width: 300,
    height: 100,
    position: 'absolute',
    top: 40,
    left: 10
  }
});

export default class Map extends Component { // eslint-disable-line


  render() { // eslint-disable-line
    return (

      <Container>

        <View style={styles.floater}>
          <Button small>
          <Icon name='beer' iconLeft  />
              <Text>C3</Text>
          </Button>
        </View>

      </Container>
    );
  }
}
