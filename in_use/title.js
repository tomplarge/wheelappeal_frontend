/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio
} from 'react-native';

const GREEN = '#4fc29f'
const ORANGE = '#ffc33d'
const timer = require('react-native-timer');

import Button from 'react-native-animated-button';
import {Actions} from 'react-native-router-flux';

export default class home extends Component {
  componentDidMount(){
    timer.setTimeout(
      this, 'next_page',() => Actions.mappage(), 1500
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style = {{top: 60, justifyContent:'center',alignItems: 'center'}}>
          <Text style={styles.welcome}>
            wheel appeal
          </Text>
          <Text style={styles.subtext}>
            the app you never knew you always needed
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GREEN,
  },
  welcome: {
    fontSize: 50,
    fontWeight: 'bold',
    color: ORANGE,
  },
  subtext: {
    fontSize: 20,
    color: "white",
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }
});
