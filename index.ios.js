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

import { Router, Scene } from 'react-native-router-flux';

import MapPage from './in_use/map'
import TitlePage from './in_use/title'
import TruckView from './in_use/truck_view'

class wheelappeal extends Component {

  render() {
    return (
      <Router>
        <Scene key = 'root'>
          <Scene key = 'title'  component = {(props) => <TitlePage {...props}/>} hideNavBar/>
          <Scene key = 'mappage'  component = {(props) => <MapPage {...props}/>}  animationStyle={this.animationStyle} hideNavBar/>
          <Scene key = 'truck_view' component = {(props) => <TruckView {...props}/>} direction = 'vertical' hideNavBar/>
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('wheelappeal', () => wheelappeal)
