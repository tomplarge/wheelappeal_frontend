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
  @observable itemCounts;
  @observable currentCount;
  constructor(props) {

    super(props);
    this.itemCounts = this.props.itemCounts;
    this.currentItem = this.props.itemName;
    this.currentCount = this.itemCounts[this.currentItem];
    if (this.currentCount == 0) {
      this.currentCount = 1;
      this.itemCounts[this.currentItem] = this.currentCount;
    }

    // we're using the invariant that one and only one of onUpdateCartPress or onAddToCartPress are passed as props
    this.exitOption = this.props.onUpdateCartPress ? "Update Cart" : "Add to Cart"
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  updateItemCount(changeType) {
    var s;
    if (changeType == 'increment') {
      this.currentCount += 1;
      sign = s;
    }
    else {

      if (this.currentCount > 0) {
        this.currentCount -= 1;
        sign = -s;
      }
    }
    this.itemCounts[this.currentItem] = this.currentCount;
  }

  render() {
    return (
      <View style = {styles.container}>
        <TouchableHighlight onPress = {() => {this.props.onExitPress()}} style = {styles.exitButton}>
          <Icon name = "add" size = {30} style = {styles.exitIcon}/>
        </TouchableHighlight>
        <Text style = {styles.titleText}>{this.toTitleCase(this.props.itemName)}</Text>
        <Text style = {styles.subtitleText}>Price</Text>
        <Text style = {styles.subtitleText}>Description</Text>
        <TouchableHighlight onPress = {() => {this.props.onUpdateCartPress ? this.props.onUpdateCartPress() : this.props.onAddToCartPress()}} style = {styles.addToCartButton}>
          <Text style = {styles.addToCartText}>{this.exitOption}</Text>
        </TouchableHighlight>
        <View style = {styles.countContainer}>
          <TouchableHighlight onPress = {() => {this.updateItemCount('decrement')}} style = {styles.countButton}>
            <Icon name = "remove" color = {GREEN} size = {30} />
          </TouchableHighlight>
          <Text style = {styles.countText}>{this.currentCount}</Text>
          <TouchableHighlight onPress = {() => {this.updateItemCount('increment')}} style = {styles.countButton}>
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
