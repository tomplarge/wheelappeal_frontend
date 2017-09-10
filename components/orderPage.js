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
import Icon from "react-native-vector-icons/MaterialIcons";
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
    this.props.cart.forEach((itemCount, itemId) => {totalPrice += this.props.truck.menu.get(itemId).item_price * itemCount});
    return totalPrice;
  }

  @computed get totalItemCount() {
    var totalCount = 0;
    this.props.cart.forEach((itemCount, itemId) => {totalCount += itemCount});
    return totalCount;
  }

  // callback function when user exits item modal
  @action onExitPress = () => {
    this.modalVisible = false;
    this.itemPressedId = null;
  }

  // callback function when user updates cart through item modal
  @action onUpdateCartPress = (item_id, newCount) => {
    // if the new count is 0, remove it from cart
    if (newCount == 0) {
      this.props.cart.delete(item_id);
    }
    else {
      this.props.cart.set(item_id, newCount);
    }
    this.closeModal();
    this.itemPressedId = null;

    // if cart is empty, return to truck view
    if (this.props.cart.keys().length < 1) {
      Actions.pop()
    }
  }

  // toggle closed the item view modal
  @action closeModal = () => {
    this.modalVisible = false;
  }

  // render touchable cart rows
  renderCart = () => {
    return (
      <View>
        {this.props.cart.keys().map((item_id) => (
          <TouchableHighlight  key = {item_id} onPress = {() => {this.itemPressedId = item_id; this.modalVisible = true;}}>
            <View style = {styles.menuItem}>
              <Text style = {styles.menuItemName}>{this.toTitleCase(this.props.truck.menu.get(item_id).item_name)}</Text>
              <Text style = {styles.menuItemCount}>{this.props.cart.get(item_id)}</Text>
            </View>
          </TouchableHighlight>
        ))}
        <View style = {styles.menuItem}>
          <Text style = {[styles.menuItemName,{color: GREEN}]}>Total: </Text>
          <Text style = {styles.menuItemCount}>${this.totalPrice}</Text>
        </View>
      </View>
    )
  }

  // render item modal view
  renderItemModal = () => {
    if (this.itemPressedId == null) {
      return (<View/>);
    }
    else {
      return (
        <MenuItemModal
          itemPressed = {this.props.truck.menu.get(this.itemPressedId)}
          itemCount = {this.props.cart.get(this.itemPressedId)}
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
          <TouchableHighlight style = {styles.backButton} onPress = {() => {Actions.pop()}}>
            <Icon name = "arrow-back" size = {25} color = {'black'}/>
          </TouchableHighlight>
        </LinearGradient>
        <ScrollView style = {styles.container}>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>{this.props.truck.truck_name}</Text>
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
    position: 'absolute'
  },
  backButton: {
    left: 10,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingBottom: 10,
    backgroundColor: 'transparent',
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    fontSize: 20,
    marginLeft: 15,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItem: {
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    position: 'relative'
  },
  menuItemName: {
    position: 'absolute',
    fontSize: 15,
    marginLeft: 15,
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
