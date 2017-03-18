import React, { Component } from 'react';

import {ListView, TouchableOpacity, StyleSheet, View} from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';

import { Grid, Col, Row, Text, Container, Header, Thumbnail, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

import AppStoreSolo from '../../Stores/AppStoreSimple';

import _ from 'lodash';


const styles = StyleSheet.create({
  floater: {
    width: 300,
    height: 100,
    position: 'absolute',
    top: 40,
    left: 10
  }
});

var Store = new AppStoreSolo({persistToDb: 'stories1'});

console.log('Store', Store);

Store.on('upCtr', function(){
  this.set('_state.ctr', new Date().getTime());
});

Store.on('addList', function(top, total){
  function makeData() {
    var name = this.chance.name();
    var img = 'https://robohash.org/'+this.chance.guid({length: 5})+'.jpg';
    return {
      name: name,
      id: this.chance.guid(),
      src: img
    };
  }
  if(total === undefined) total = 1;
  if(top === undefined ) top = false;
  if(top) {
    for(i=0; i< total; i++) {
      rdata = makeData.call(this);
      this.unshift('_state.lists', rdata);
    }

  } else {
    for(i=0; i< total; i++) {
      rdata = makeData.call(this);
      this.push('_state.lists', rdata);
    }

  }

});

Store.on('remList', function(id){
  var all = this.get('_state.lists');

  for(i=0; i<all.length; i++) {

    if(all[i].id === id) {
      this.splice('_state.lists', i, 1);
      console.log("DELETE ", id, i);
      break;
    }
  }


});

Store.on('rename', function(id){
  var all = this.get('_state.lists');

  for(i=0; i<all.length; i++) {

    if(all[i].id === id) {
      this.set('_state.lists.'+ i +'.name', this.chance.name());

      break;
    }
  }
});

class Screen1 extends Store.BaseComponent {

static navigationOptions = {
    title: "Stories One",
    renderRightComponent: function() {
      return (<TouchableOpacity><Icon name='close'></Icon></TouchableOpacity>);
    }
  }
  constructor(p) {
    super(p);
    this.Store = Store;
    this.initState = {
      ctr: 0, lists: []
    };

  }

  rList() {
    var Li = [];
    this.state.lists.map((item, i) => {

      Li.push(<ListItem key={item.id} >
          <Thumbnail style={{width: 50, height: 50, marginRight: 10}}  square source={{uri: item.src}}></Thumbnail>
          <Text>{i}. {item.name}</Text>

        <Right>
          <Button small index={i} onPress={() => {Store.fire('remList', item.id)}}>
            <Icon name='close'></Icon>
          </Button>
        </Right>
      </ListItem>)
    });

    if(Li.length < 1) return (<ListItem><Text>Nada</Text></ListItem>);

    return Li;

  }

  render() {

      return (
        <Container>
          <Grid>
            <Row style={{height: 60}}>
              <Col>
              <Button onPress={() => { this.Store.fire('upCtr'); this.Store.fire('addList') }}>
                <Text>$$$</Text>
              </Button>
            </Col>
            <Col>
              <Button onPress={() => { this.Store.fire('upCtr'); this.Store.fire('addList', false, 10) }}>
                <Text>10 butt</Text>
              </Button>
            </Col>
            <Col>
              <Button danger onPress={() => {  this.Store.fire('addList', true) }}>
                <Text>$$$</Text>
              </Button>
            </Col>
            <Col>
              <Button danger onPress={() => {  this.Store.fire('addList', true, 10) }}>
                <Text>10 top</Text>
              </Button>


            </Col>
            <Col>
              <Button warning onPress={() => {  this.Store.resetStateAndDb() }}>
                <Text>Z</Text>
              </Button>
            </Col>
            </Row>
            <Row>
              <List
                dataArray={this.state.lists}
                renderRow={this.renderRow.bind(this)}
              />
            </Row>
          </Grid>



        </Container>
      );

  }

  renderRow(item, sectionID, rowID, highlightRow) {
    if (item === undefined) return (<ListItem><Text>Nada</Text></ListItem>);
    return (<ListItem key={item.id} >
          <TouchableOpacity onPress={() => {Store.fire('rename', item.id)}}>
            <Thumbnail style={{width: 50, height: 50, marginRight: 10}}  square source={{uri: item.src}}></Thumbnail>
          </TouchableOpacity>

          <Text> {rowID} {item.name}</Text>

        <Right>
          <Button small onPress={() => {Store.fire('remList', item.id)}}>
            <Icon name='close'></Icon>
          </Button>
        </Right>
      </ListItem>);

  }


}

export default Screen1;
