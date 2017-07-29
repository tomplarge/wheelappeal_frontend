import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import Icon from "react-native-vector-icons/MaterialIcons";

const screen = Dimensions.get('window');
const GREEN = '#00d38e'
const ORANGE = '#ffb123'

export default class MenuItemModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style = {styles.container}>
        <TouchableHighlight onPress = {() => {this.props.onExitPress()}} style = {styles.exitButton}>
          <Icon name = "add" size = {30} style = {styles.exitIcon}/>
        </TouchableHighlight>
        <Text style = {styles.titleText}> {this.props.itemName} </Text>
        <Text style = {styles.subtitleText}> Price </Text>
        <Text style = {styles.subtitleText}> Description </Text>
        <TouchableHighlight onPress = {() => {this.props.onAddToCartPress()}} style = {styles.addToCartButton}>
          <Text style = {styles.addToCartText}> Add to Cart </Text>
        </TouchableHighlight>
        <View style = {styles.countContainer}>
          <TouchableHighlight onPress = {() => {console.log('Decrease')}} style = {styles.countButton}>
            <Icon name = "remove" color = {GREEN} size = {30} />
          </TouchableHighlight>
          <Text style = {styles.countText}> 1 </Text>
          <TouchableHighlight onPress = {() => {console.log('Increase')}} style = {styles.countButton}>
            <Icon name = "add" color = {GREEN} size = {30}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: screen.width - 100,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addToCartButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: GREEN,
    borderRadius: 6,
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 15,
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
  countButton: {
    justifyContent: 'center',
  },
  countText: {
    fontSize: 30,
  },
  countContainer: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 30,
    backgroundColor: 'transparent',
  },
  subtitleText: {
    fontSize: 20,
    backgroundColor: 'transparent',
  },
})
