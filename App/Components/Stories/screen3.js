import React, { Component } from 'react';

import {ListView, TouchableOpacity, StyleSheet, View} from 'react-native';

import { Grid, Col, Row, Text, Container, Header, Thumbnail, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

import ImmutableListView from 'react-native-immutable-list-view';

import _ from 'lodash';

import AppStoreSolo from '../../Stores/AppStoreSimple2';

const $js = require('../../Lib/kx-serialize-javascript');
const $ju = function(s) {return eval('('+s+')')};


const styles = StyleSheet.create({
  floater: {
    width: 300,
    height: 100,
    position: 'absolute',
    top: 40,
    left: 10
  }
});

var Store = new AppStoreSolo({persistToDb: 'stories3'});

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
      src: img,
      bicon: $js(() => {return (<Text>Y</Text>)})
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

Store.observe('_state.lists', _.debounce(function() {
  
  var ki = {};
  var lists = this.get('_state.lists');
  if(lists) {
    for(i=0; i<lists.length; i++){
      ki[lists[i]['id']] = i;
    }
  
    this.set('_state.listsMap', ki);  
  
  }
    
}));

Store.on('remList', function(id){
  
  var index = this.get('_state.listsMap.' + id);
  if(index > -1) {
    this.splice('_state.lists', index, 1);
    return;
  }
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
  
  function update(i) {
    var img = 'https://robohash.org/'+this.chance.guid({length: 5})+'.jpg';
    //this.set('_state.lists.'+ i +'.src', img);
    this.set('_state.lists.'+ i +'._rnd', Math.random());
    this.set('_state.lists.'+ i +'.bicon', $js(() => {return(<Icon name='ios-cog'></Icon>)}) );

    this.set('_state.lists.'+ i +'.name', this.chance.name());

    console.log('[Event] rename', this.get('_state.lists.'+ i ));
  }
  
  var index = this.get('_state.listsMap.' + id);
  if(index > -1) {
    update.call(this, index);
    return;
  }
  
  
  for(i=0; i<all.length; i++) {

    if(all[i].id === id) {
      update.call(this, i);
      break;
    }
  }
});

class Screen3 extends Store.BaseComponent {

static navigationOptions = {
    title: "Stories Two",
    renderRightComponent: function() {
      return (<TouchableOpacity><Icon name='close'></Icon></TouchableOpacity>);
    }
  }
  constructor(p) {
    super(p);
    this.setStore(Store);
    this.initState = {
      ctr: 0, lists: []
    };

  }

  render() {
    
    var idata = this.Store.get('_state$');
    var data = this.Store.get('_state.lists');
    //console.log("RENDER CALLED", idata, data);
    ImList = <View></View>;
    if(idata && data) {
        
        ImList = <ImmutableListView
            immutableData={idata.get('lists')}
            renderRow={this.irenderRow.bind(this)}
          />;
    }
     

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
            <Row style={{height: 40}}>
                <Col><Text>Total Rows: {this.state.lists.length}</Text></Col>
            </Row>
            <Row>
              
             {ImList}
              
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

          <Text> {item.name}</Text>

        <Right>
          <Button small onPress={() => {Store.fire('remList', item.id)}}>
            {(function(item){
              if(item.bicon) {
                var Vcomp = $ju(item.bicon);
                return <Vcomp />;
              }

            })(item)}
          </Button>
        </Right>
      </ListItem>);

  }

 irenderRow(item, sectionID, rowID, highlightRow) {
     var item = item.toJS();
     //console.log('irenderRow', item, arguments);
    if (item === undefined) return (<ListItem><Text>Nada</Text></ListItem>);
    return (<ListItem key={item.id} >
          <TouchableOpacity onPress={() => {Store.fire('rename', item.id)}}>
            <Thumbnail style={{width: 50, height: 50, marginRight: 10}}  square source={{uri: item.src}}></Thumbnail>
          </TouchableOpacity>

          <Text>{rowID} {item.name}</Text>

        <Right>
          <Button small onPress={() => {Store.fire('remList', item.id)}}>
            {(function(item){
              if(item.bicon) {
                var Vcomp = $ju(item.bicon);
                return <Vcomp />;
              }

            })(item)}
          </Button>
        </Right>
      </ListItem>);

  }

}

export default Screen3;
