import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';

import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Spinner from 'react-native-loading-spinner-overlay';
import {observer} from 'mobx-react';
import {observable, action} from "mobx"

const screen = Dimensions.get('window');
const GREEN = '#00d38e';
const DRK_GREEN = '#1c9963';
const ORANGE = '#ffb123';
const MODAL_WIDTH = 200;
const MODAL_HEIGHT = 150;
const visa_img = require('./visa.jpg')

@observer export default class CheckoutModal extends Component {
  @observable loadingSpinnerVisible = false;

  constructor(props) {
    super(props);
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  @action onConfirmPaymentPress = async () => {
    this.loadingSpinnerVisible = true;
    await this.props.onConfirmPaymentPress();
  }

  @action onPaymentConfirmed = () => {
    this.props.onPaymentConfirmed();
  }

  render() {
    return (
      <View style = {styles.container}>
        <TouchableHighlight onPress = {() => {this.props.onExitPress()}} style = {styles.exitButton}>
          <Icon name = "add" size = {30} style = {styles.exitIcon}/>
        </TouchableHighlight>
        <View style = {styles.creditInfoContainer}>
          <Image style = {styles.creditImage} source = {visa_img}/>
          <View>
            <Text style = {styles.creditText}>••••••••••••5765</Text>
            <Text style = {[styles.creditText, {fontSize: 10, color: 'darkgrey'}]}>Thomas P Large</Text>
          </View>
          <Text style = {[styles.creditText, {color: GREEN}]}>{this.props.totalPrice}.00</Text>
        </View>
        <TouchableHighlight
          onPress = {() => {this.onConfirmPaymentPress()}}
          style = {styles.confirmButton}
          underlayColor = {DRK_GREEN}
        >
          {
            this.loadingSpinnerVisible
            ? <ActivityIndicator animating = {true} color = {'white'}/>
            : <Text style = {styles.confirmText}>Confirm Payment</Text>
          }
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: MODAL_HEIGHT,
    width: MODAL_WIDTH,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: GREEN,
    borderRadius: 6,
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontFamily: 'Arial Rounded MT Bold',
  },
  exitButton: {
    justifyContent: 'center',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    width: 30,
  },
  exitIcon: {
    left: 0,
    transform: [{rotate: '45deg'}],
    color: GREEN,
    backgroundColor: 'transparent',
  },
  creditInfoContainer: {
    width: MODAL_WIDTH,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center'
  },
  creditImage: {
    left: 0,
    width: 45,
    height: 30,
  },
  creditText: {
    right: 0,
    fontSize: 12,
    fontWeight: 'bold',
  },
})
