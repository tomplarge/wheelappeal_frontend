import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {Actions} from 'react-native-router-flux';
import {observer} from 'mobx-react';
import {observable} from "mobx"

import MenuItemModal from './menuItemModal'
const screen = Dimensions.get('window');
const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const GREEN2 = '#00b789'

@observer export default class OrderPage extends Component {
  @observable itemPressed = null;
  @observable modalOpen = false;
  @observable cart;

  constructor(props) {
    // console.log("Constructing OrderPage");
    super(props);
    this.cart = this.props.cart;
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  renderCart = () => {
    return (
      <View>
        {Object.keys(this.cart.itemCounts).filter((item_name) => {return this.cart.itemCounts[item_name].count > 0}).map((item_name, i) => (
          <TouchableHighlight  key = {i} onPress = {() => {this.itemPressed = this.cart.itemCounts[item_name].item; this.modalOpen = true;}}>
            <View style = {styles.menuItem}>
              <Text style = {styles.menuItemName}>{this.toTitleCase(item_name)}</Text>
              <Text style = {styles.menuItemCount}>{this.cart.itemCounts[item_name].count}</Text>
            </View>
          </TouchableHighlight>
        ))}
        <View style = {styles.menuItem}>
          <Text style = {[styles.menuItemName,{color: GREEN}]}>Total: </Text>
          <Text style = {styles.menuItemCount}>${this.cart.totalPrice}</Text>
        </View>
      </View>
    )
  }

  onExitPress = () => {
    this.modalOpen = false;
    this.itemPressed = null;
  }

  onUpdateCartPress = (newCount) => {
    // itemPressed is still the item that was selected
    this.cart.numItems += newCount;
    this.cart.totalPrice -= this.cart.itemCounts[this.itemPressed.item_name].count * this.itemPressed.item_price;
    this.cart.itemCounts[this.itemPressed.item_name].count = newCount;
    this.cart.totalPrice += this.cart.itemCounts[this.itemPressed.item_name].count * this.itemPressed.item_price;
    this.modalOpen = false;
    this.itemPressed = null;
  }

  renderItemModal = () => {
    if (this.itemPressed == null) {
      return (<View/>);
    }
    else {
      return (
        <MenuItemModal
          itemCount = {this.cart.itemCounts[this.itemPressed.item_name].count}
          itemPressed = {this.itemPressed}
          onExitPress = {this.onExitPress}
          onUpdateCartPress = {this.onUpdateCartPress}
        />
      );
    }
  }

  render(){
    // console.log("Rendering OrderPage");
    return(
      <View style = {styles.container}>
        <Modal isVisible={this.modalOpen}>
          {this.renderItemModal()}
        </Modal>
        <LinearGradient colors = {[GREEN, GREEN2]} style = {styles.topTabBar}>
          <Text style = {styles.topTabBarText}>Your Order</Text>
        </LinearGradient>
        <ScrollView style = {styles.container}>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>Truck Name</Text>
          </View>
          {this.renderCart()}
        </ScrollView>
        <TouchableHighlight style = {styles.bottomTabBar} onPress = {() => {Actions.map()}}>
          <Text style = {styles.bottomTabBarText}>Order</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topTabBar: {
    backgroundColor: GREEN,
    height: 75,
    justifyContent: 'center',
  },
  topTabBarText: {
    fontSize: 20,
    alignSelf:'center',
    backgroundColor: 'transparent',
    fontFamily: 'Arial Rounded MT Bold',
  },
  bottomTabBar: {
    backgroundColor: GREEN,
    height: 50,
    justifyContent: 'center',
  },
  bottomTabBarText: {
    fontSize: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Arial Rounded MT Bold',
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  titleText: {
    fontSize: 40,
    backgroundColor: 'transparent',
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    fontSize: 20,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItem: {
    width: screen.width,
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    position: 'relative'
  },
  menuItemName: {
    position: 'absolute',
    fontSize: 15,
    left: 5,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemCount: {
    color: GREEN,
    position: 'absolute',
    fontSize: 15,
    right: 5,
    fontFamily: 'Arial Rounded MT Bold',
  },
})
