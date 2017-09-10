import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {observer} from 'mobx-react';
import {observable, action} from "mobx"

const screen = Dimensions.get('window');
const GREEN = '#00d38e';
const DRK_GREEN = '#1c9963';
const ORANGE = '#ffb123';
const MODAL_WIDTH = 300;
const MODAL_HEIGHT = 200;

@observer export default class MenuItemModal extends Component {
  @observable currentCount;
  @observable USER_FAV;

  constructor(props) {
    super(props);
    // we're using the invariant that one and only one of onUpdateCartPress or onAddToCartPress are passed as props
    this.setCurrentCount()
    this.USER_FAV = false;
  }

  @action setCurrentCount = () => {
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

  @action onDecreaseCountPress = () => {
    // console.log(this.exitOption)
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

  @action onIncreaseCountPress = () => {
    this.currentCount += 1
  }

  @action onFavPress = () => {
    this.USER_FAV = !this.USER_FAV;
  }

  render() {
    return (
      <View style = {styles.container}
        onStartShouldSetResponder = {() => {return true}}
        onLayout = {this.props.onLayout}>
        <TouchableHighlight onPress = {() => {this.props.onExitPress()}} style = {styles.exitButton} underlayColor = {'transparent'}>
          <Icon name = "add" size = {30} style = {styles.exitIcon}/>
        </TouchableHighlight>
        <TouchableHighlight onPress = {() => {this.onFavPress()}} style = {styles.favButton} underlayColor = {'transparent'}>
          <CommunityIcon name = {this.USER_FAV ? "heart" : "heart-outline"} size = {30} style = {styles.favIcon}/>
        </TouchableHighlight>
        <Text style = {styles.titleText}>{this.toTitleCase(this.props.itemPressed.item_name)}</Text>
        <Text style = {[styles.subtitleText, {color: GREEN}]}>$ {this.props.itemPressed.item_price}</Text>
        <Text style = {styles.subtitleText}>Description</Text>
        <TouchableHighlight
          onPress = {() => {
            this.props.onUpdateCartPress ?
            this.props.onUpdateCartPress(this.props.itemPressed.item_id, this.currentCount) :
            this.props.onAddToCartPress(this.props.itemPressed.item_id, this.currentCount)}
          }
          style = {styles.addToCartButton}
          underlayColor = {DRK_GREEN}
        >
          <Text style = {styles.addToCartText}>{this.exitOption}</Text>
        </TouchableHighlight>
        <View style = {styles.countContainer}>
          <TouchableHighlight onPress = {() => {this.onDecreaseCountPress()}} style = {styles.decrementCountButton} underlayColor = {'transparent'}>
            <Icon name = "remove" color = {GREEN} size = {30} />
          </TouchableHighlight>
          <Text style = {styles.countText}>{this.currentCount}</Text>
          <TouchableHighlight onPress = {() => {this.onIncreaseCountPress()}} style = {styles.incrementCountButton} underlayColor = {'transparent'}>
            <Icon name = "add" color = {GREEN} size = {30}/>
          </TouchableHighlight>
        </View>
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
    borderWidth: 1,
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
  favButton: {
    justifyContent: 'center',
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    width: 30,
    position: 'absolute'
  },
  favIcon: {
    right: 0,
    color: GREEN,
    backgroundColor: 'transparent',

  },
  decrementCountButton: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  incrementCountButton: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0
  },
  countText: {
    fontSize: 30,
    fontFamily: 'Arial Rounded MT Bold',
  },
  countContainer: {
    position: 'absolute',
    bottom: 0,
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
    width: 100,
  },
  titleText: {
    marginLeft: 10,
    fontSize: 30,
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'grey'
  },
})
