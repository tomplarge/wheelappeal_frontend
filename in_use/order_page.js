import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GREEN = '#00d38e'
const ORANGE = '#ffb123'

export default class OrderPage extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <View style = {{flex: 1, justifyContent: 'center', alignItems:'center'}}>
        <Text> Orders Page! </Text>
      </View>
    )
  }
}
