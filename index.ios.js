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
import {useStrict} from 'mobx'

import MapPage from './components/map'
import TitlePage from './components/title'
import OrderPage from './components/orderPage'
import TruckView from './components/truckView'
import TruckStore from './stores/truckStore';

const GREEN = '#00d38e'
const ORANGE = '#ffb123'

//useStrict(true) // this breaks the map set current location since map view doesn't use mobx
class wheelappeal extends Component {

  componentWillMount() {
    // create new truck store instance
    truckStore = new TruckStore();
  }

  render() {
    return (
      <Router>
        <Scene key = 'root'>
          <Scene key = 'map' component = {MapPage} truckStore={truckStore} hideNavBar initial/>
          <Scene key = 'order' component = {OrderPage} {...this.props}/>
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
