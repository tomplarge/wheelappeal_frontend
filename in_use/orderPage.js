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
        {Object.keys(this.cart.itemCounts).filter((key) => {return this.cart.itemCounts[key].count > 0}).map((key, i) => (
          <TouchableHighlight  key = {i} onPress = {() => {this.itemPressed = this.cart.itemCounts[key].item; this.modalOpen = true;}} style = {styles.menuItem}>
            <View>
              <Text style = {styles.menuItemName}>{this.toTitleCase(key)}</Text>
              <Text style = {styles.menuItemCount}>{this.cart.itemCounts[key].count}</Text>
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
    this.cart.totalPrice -= this.cart.itemCounts[this.itemPressed.item].count * this.itemPressed.price;
    this.cart.itemCounts[this.itemPressed.item].count = newCount;
    this.cart.totalPrice += this.cart.itemCounts[this.itemPressed.item].count * this.itemPressed.price;
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
          itemCount = {this.cart.itemCounts[this.itemPressed.item].count}
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
        <Modal isVisible={this.modalOpen}>
          {this.renderItemModal()}
        </Modal>
        <View style = {styles.topTabBar}>
          <Text style = {styles.topTabBarText}>Your Order</Text>
        </View>
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
  },
  editButton: {
    
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
  },
  cartItemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems:'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  cartItemText: {
    fontSize: 20,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  titleText: {
    fontSize: 40,
    backgroundColor: 'transparent',
  },
  subtitleText: {
    fontSize: 20,
  },
  menuItem: {
    width: screen.width,
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  menuItemName: {
    position: 'absolute',
    fontSize: 15,
    left: 5,
  },
  menuItemCount: {
    color: GREEN,
    position: 'absolute',
    fontSize: 15,
    right: 5,
  },
})
