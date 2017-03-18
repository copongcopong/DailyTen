import React, { Component } from 'react';
import { Text, Container, Header, Title, Content, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon, View } from 'native-base';

export default class BaseModal extends Component {

  render() {

    const {state} = this.props.navigation;
    //console.log('NAVVV', state, this.props.navigation);
    if(state.params.Component === undefined) {
      return (
        <Container>
        <Header noShadow={true} style={{height: 50}}>
          <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="close" />
          </Button>
          </Left>

        </Header>
          <Content>
            <Text>Modal Component not found.</Text>
            <Button onPress={() => this.props.navigation.goBack()}>
              <Text>Close Me</Text>
            </Button>
          </Content>

        </Container>
      )
    } else {
      var ModalViewComponent = state.params.Component;
      var showHeader = state.params.showHeader || false;
      var DefaultHeader = () => {return (

        <Header noShadow={true} style={{height: 50}}>
          <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="close" />
          </Button>
          </Left>

        </Header>
      )};

      return (
        <Container>
          {(showHeader) ? <DefaultHeader /> : null}

          <ModalViewComponent navigation={state} />

        </Container>

      )

      //return ModalViewComponent({navigation: state});
    }

  }

}
