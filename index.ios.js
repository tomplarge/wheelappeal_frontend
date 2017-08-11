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
import OrderPage from './in_use/orderPage'
import TruckView from './in_use/truckView'

const GREEN = '#00d38e'
const ORANGE = '#ffb123'
class wheelappeal extends Component {
  componentWillMount() {
    // gather data
  }

  render() {
    return (
      <Router>
        <Scene key = 'root'>
          <Scene key = 'map' component = {MapPage} hideNavBar initial/>
          <Scene key = 'order' component = {OrderPage}/>
          <Scene key = 'truck' component = {TruckView} {...this.props} direction = 'vertical' panHandlers={null}/>
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('wheelappeal', () => wheelappeal)

/* Reserves
<TruckView
  truckName = {'Truck Name'}
  menu = {[{item:'Item 1',price:1},{item:'Item 2',price:2},{item:'Item 3',price:3}]}
/>

render() {
  return (
    <ScrollableTabView tabBarPosition = {'bottom'} tabBarActiveTextColor = {GREEN} tabBarUnderlineStyle = {{backgroundColor: GREEN}} scrollWithoutAnimation = {true} locked = {true} >
      <MapPage tabLabel="Map" />
      <OrderPage tabLabel="Orders" />
    </ScrollableTabView>
  )
}
*/
