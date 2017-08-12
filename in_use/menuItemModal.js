import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import Icon from "react-native-vector-icons/MaterialIcons";
import {observer} from 'mobx-react';
import {observable} from "mobx"

const screen = Dimensions.get('window');
const GREEN = '#00d38e'
const ORANGE = '#ffb123'

@observer export default class MenuItemModal extends Component {
  @observable currentCount;
  constructor(props) {
    super(props);
    // we're using the invariant that one and only one of onUpdateCartPress or onAddToCartPress are passed as props
    if (this.props.onUpdateCartPress) {
      this.exitOption = "Update Cart";
      this.currentCount = this.props.itemCount;
    } else {
      this.exitOption = "Add to Cart";
      this.currentCount = 1;
    }
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  onDecreaseCountPress = () => {
    console.log(this.exitOption)
    if (this.currentCount > 1) {
      this.currentCount -= 1;
    }
    else if (this.exitOption == "Update Cart") {
      this.currentCount = 0;
    }
    else {
      this.currentCount = 1;
    }
  }
  render() {
    return (
      <View style = {styles.container}>
        <TouchableHighlight onPress = {() => {this.props.onExitPress()}} style = {styles.exitButton}>
          <Icon name = "add" size = {30} style = {styles.exitIcon}/>
        </TouchableHighlight>
        <Text style = {styles.titleText}>{this.toTitleCase(this.props.itemPressed.item)}</Text>
        <Text style = {styles.subtitleText}>${this.props.itemPressed.price}</Text>
        <Text style = {styles.subtitleText}>Description</Text>
        <TouchableHighlight onPress = {() => {this.props.onUpdateCartPress ? this.props.onUpdateCartPress(this.currentCount) : this.props.onAddToCartPress(this.currentCount)}} style = {styles.addToCartButton}>
          <Text style = {styles.addToCartText}>{this.exitOption}</Text>
        </TouchableHighlight>
        <View style = {styles.countContainer}>
          <TouchableHighlight onPress = {() => {this.onDecreaseCountPress()}} style = {styles.countButton}>
            <Icon name = "remove" color = {GREEN} size = {30} />
          </TouchableHighlight>
          <Text style = {styles.countText}>{this.currentCount}</Text>
          <TouchableHighlight onPress = {() => {this.currentCount += 1}} style = {styles.countButton}>
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
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    fontFamily: 'Arial Rounded MT Bold',
  },
})
