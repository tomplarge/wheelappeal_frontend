/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/
import React, { Component} from 'react';
import {
AppRegistry,
Navigator,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Router, Scene } from 'react-native-router-flux';

import MapPage from './in_use/map'
import TitlePage from './in_use/title'
import OrderPage from './in_use/order_page'

const GREEN = '#00d38e'
const ORANGE = '#ffb123'
class wheelappeal extends Component {

  render() {
    return (
      <ScrollableTabView tabBarPosition = {'bottom'} tabBarActiveTextColor = {GREEN} tabBarUnderlineStyle = {{backgroundColor: GREEN}} scrollWithoutAnimation = {true} locked = {true} >
        <MapPage tabLabel="Map" />
        <OrderPage tabLabel="Orders" />
      </ScrollableTabView>
    )
  }
}

AppRegistry.registerComponent('wheelappeal', () => wheelappeal)

/* Reserves
render() {
  return (
    <Router>
      <Scene key = 'root'>
        <Scene key = 'title'  component = {(props) => <TitlePage {...props}/>} hideNavBar/>
        <Scene key = 'mappage'  component = {(props) => <MapPage {...props}/>} initial animationStyle={this.animationStyle} hideNavBar/>
      </Scene>
    </Router>
  )
}
*/
