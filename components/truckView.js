import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  ListView,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';

const screen = Dimensions.get('window');
import {observer} from 'mobx-react';
import {observable, computed, action, extendObservable} from "mobx"
import Button from 'react-native-animated-button';
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';

import MenuItemModal from './menuItemModal'
//TODO: Fix .bind(this)

const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const MENU_ITEMS_NUM = 3
const MENU_ITEM_HEIGHT = 50
const food_truck_img = require('./food-truck-img.jpg')

@observer export default class TruckView extends Component {
  @observable itemPressedId = null;
  @observable modalVisible = false;
  @observable cart = new Map() // {item_id: item_count}

  constructor(props) {
    // console.log("Constructing TruckView");
    super(props);
  }

  @computed get totalPrice() {
    var totalPrice = 0;
    this.cart.forEach((itemCount, itemId) => {totalPrice += this.props.truck.menu[itemId].item_price * itemCount});
    return totalPrice;
  }

  @computed get totalItemCount() {
    var totalCount = 0;
    this.cart.forEach((itemCount, itemId) => {totalCount += itemCount});
    return totalCount;
  }

  @action onExitPress = () => {
    this.itemPressedId = null;
  }

  @action onAddToCartPress = (item_id, itemCountIncrease) => {
    if (this.cart.has(item_id)) {
      this.cart.set(item_id, this.cart.get(item_id) + itemCountIncrease);
    }
    else {
      this.cart.set(item_id, itemCountIncrease);
    }
    this.closeModal()
    this.itemPressedId = null;
  }

  @action closeModal = () => {
    this.modalVisible = false;
  }

  @action openModal = (item_id) => {
    this.itemPressedId = item_id;
    this.modalVisible = true;
  }

  renderMenu = () => {
    return (
      <View>
        {this.props.truck.menu.forEach((item, item_id) => (
          <TouchableHighlight  key = {i} onPress = {() => {this.openModal(item_id)}} style = {styles.menuItem}>
            <View>
              <Text style = {styles.menuItemName}>{this.toTitleCase(item.item_name)}</Text>
              <Text style = {styles.menuItemCount}>{this.cart.get(item_id)}</Text>
              <Text style = {styles.menuItemPrice}>${item.item_price}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    );
  }

  renderItemModal = () => {
    if (this.itemPressedId != null) {
      return (
        <MenuItemModal
          itemPressed = {this.props.truck.menu[this.itemPressedId]}
          itemCount = {this.cart.get(this.itemPressedId)}
          onExitPress = {this.onExitPress}
          onAddToCartPress = {this.onAddToCartPress}
        />
      );
    }
    else {
      return <View/>
    }
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  render() {
    // console.log("Rendering TruckView");
      // console.log(this.cart.numItems, this.cart.itemCounts, this.cart.totalPrice);
    return (
      <View style = {styles.container}>
        <Modal isVisible={this.modalVisible}>
          {this.renderItemModal()}
        </Modal>
        <ScrollView style={styles.container}>
          <View style = {styles.imageContainer}>
            <Image style = {styles.image} source = {food_truck_img}>
            </Image>
          </View>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>{this.toTitleCase(this.props.truck.truck_name)} </Text>
            <Text style = {styles.subtitleText}>Mexican</Text>
            <Text style = {styles.subtitleText}>4 minute walk</Text>
          </View>
          <MapView
            showsUserLocation
            style= {styles.map}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
          </MapView>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>Menu</Text>
          </View>
          {this.renderMenu()}
        </ScrollView>
        <View style = {styles.bottomTab}>
          <Text style = {styles.cartText}>Total Price:  ${this.totalPrice}</Text>
          <Text style = {styles.cartText}>Item Count:  {this.totalItemCount}</Text>
          <TouchableHighlight onPress = {() => {this.totalPrice > 0 ? this.props.onCheckoutPress(this.cart) : null}}
            style = {[styles.checkoutButton, {backgroundColor: this.totalItemCount > 0 ? GREEN : 'grey'}]}>
            <Text style = {styles.checkoutButtonText}>Checkout</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style = {styles.backButton} onPress = {() => {Actions.pop()}}>
          <Icon name = "arrow-back" size = {25} color = {GREEN} style = {styles.backButtonIcon}/>
        </TouchableHighlight>
        <TouchableHighlight style = {styles.favButton}>
          <Icon name = "favorite" size = {25} color = {GREEN} style = {styles.favButtonIcon}/>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: screen.width,
    height: 250,
    top: 0,
  },
  image: {
    top: 0,
    flex: 1,
    resizeMode: Image.resizeMode.stretch,
    width: screen.width,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    width: 25,
    alignSelf: 'center',
    fontFamily: 'Arial Rounded MT Bold',
  },
  favButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButtonIcon: {
    width: 25,
    alignSelf: 'center',
  },
  titleContainer: {
    flex: 1,
    width: screen.width,
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
  },
  titleText: {
    fontSize: 40,
    left: 0,
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    fontSize: 15,
    left: 0,
    fontFamily: 'Arial Rounded MT Bold',
  },
  map: {
    height: 250,
    width: screen.width,
    flex: 1,
  },
  bottomTab: {
    height: 75,
    width: screen.width,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  checkoutButton: {
    position: 'absolute',
    height: 50,
    width: 120,
    right: 10,
    borderRadius: 6,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 15,
    fontFamily: 'Arial Rounded MT Bold',
  },
  cartText: {
    left: 10,
    fontSize: 15,
    color: GREEN,
    fontFamily: 'Arial Rounded MT Bold',
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
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemPrice: {
    position: 'absolute',
    fontSize: 15,
    right: 5,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemCount: {
    color: GREEN,
    position: 'absolute',
    left: 100
  },
});

/* Reserves

*/
