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
import {observable, computed, action} from "mobx"

// import self-created modules
import MenuItemModal from './menuItemModal'

// import stores
import TruckStore from '../stores/truckStore'

// Global constants
const SCREEN = Dimensions.get('window');
const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const GREEN2 = '#00b789'

@observer export default class OrderPage extends Component {
  @observable itemPressedId = null;
  @observable modalVisible = false;
  @observable cart;

  constructor(props) {
    super(props);
  }

  // return capitalized string
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  @computed get totalPrice() {
    var totalPrice = 0;
    this.cart.forEach((itemCount, itemId) => {totalPrice += this.props.truck.menu.get(itemId).item_price * itemCount});
    return totalPrice;
  }

  @computed get totalItemCount() {
    var totalCount = 0;
    this.cart.forEach((itemCount, itemId) => {totalCount += itemCount});
    return totalCount;
  }

  // render touchable cart rows
  renderCart = () => {
    return (
      <View>
        {Object.keys(this.cart.itemCounts).filter((item_name) => {return this.cart.itemCounts[item_name].count > 0}).map((item_name, i) => (
          <TouchableHighlight  key = {i} onPress = {() => {this.itemPressed = this.cart.itemCounts[item_name].item; this.modalVisible = true;}}>
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

  // callback function when user exits item modal
  onExitPress = () => {
    this.modalVisible = false;
    this.itemPressed = null;
  }

  // callback function when user updates cart through item modal
  onUpdateCartPress = (newCount) => {
    // if the item is in the cart, add the new item count
    if (this.cart.has(item_id)) {
      this.cart.set(item_id, this.cart.get(item_id) + itemCountIncrease);
    }
    // if the item isn't in the cart, add it with the new item count
    else {
      this.cart.set(item_id, itemCountIncrease);
    }
    this.closeModal()
    this.itemPressedId = null;
  }

  // render item modal view
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
    return(
      <View style = {styles.container}>
        <Modal isVisible={this.modalVisible}>
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
    width: SCREEN.width,
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
