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

import {observer} from 'mobx-react';
import {observable, computed, action, extendObservable} from "mobx"
import Button from 'react-native-animated-button';
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

// self-created modules
import MenuItemModal from './menuItemModal'
import CheckoutModal from './checkoutModal'
// import stores
import TruckStore from '../stores/truckStore'

// Global constants
const SCREEN = Dimensions.get('window');
const GREEN = '#00d38e';
const TRNS_GREEN = '#00d38e80';
const DRK_GREEN = '#1c9963';
const ORANGE = '#ffb123';
const MENU_ITEM_HEIGHT = 100;
const food_truck_img = require('./food-truck-img.jpg');

@observer export default class TruckView extends Component {
  @observable itemPressedId = null;
  @observable modalVisible = false;
  @observable checkoutModalVisible = false;
  @observable cart = new Map(); // {item_id: item_count}

  @observable favPressed = false;

  constructor(props) {
    super(props);
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

  @action onExitPress = () => {
    this.closeModal()
    this.itemPressedId = null;
  }

  onFavPress = () => {
    this.favPressed = !this.favPressed;
  }

  // callback function when user adds item to cart
  @action onAddToCartPress = (item_id, itemCountIncrease) => {
    // if the item is in the cart, add the new item count
    if (this.cart.has(item_id)) {
      this.cart.set(item_id, this.cart.get(item_id) + itemCountIncrease);
    }
    // if the item isn't in the cart, add it with the new item count
    else {
      this.cart.set(item_id, itemCountIncrease);
    }
    this.closeModal();
    this.itemPressedId = null;
  }

  // toggle closed the item view modal
  @action closeModal = () => {
    this.modalVisible = false;
    this.checkoutModalVisible = false;
  }

  // toggle open the item view modal
  @action openModal = (item_id) => {
    this.itemPressedId = item_id;
    this.modalVisible = true;
  }

  // move this to some other utils?
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  // render menu by looping through truck menu
  renderMenu = () => {
    return (
      <View>
        {this.props.truck.menu.keys().map((item_id) => (
            <TouchableHighlight  key = {item_id} onPress = {() => {this.openModal(item_id)}} underlayColor = {'darkgrey'}>
              <View style = {styles.menuItem}>
                {this.renderItemCountView(item_id)}
                <Text style = {styles.menuItemName}>{this.toTitleCase(this.props.truck.menu.get(item_id).item_name)}</Text>
                <Text style = {styles.menuItemPrice}>{this.props.truck.menu.get(item_id).item_price}.00</Text>
              </View>
            </TouchableHighlight>
          ))}
      </View>
    );
  }

  // render item view modal with appropriate props
  renderItemModal = () => {
    if (this.itemPressedId != null) {
      return (
        <MenuItemModal
          itemPressed = {this.props.truck.menu.get(this.itemPressedId)}
          itemCount = {this.cart.get(this.itemPressedId)}
          onExitPress = {this.onExitPress}
          onAddToCartPress = {this.onAddToCartPress}
          onResponderRelease = {this.closeModal}
          onLayout = {this.onModalLayout}
        />
      );
    }
    else {
      return <View/>
    }
  }

  renderCheckoutModal = () => {
    if (true) {
      return (
        <CheckoutModal
          totalPrice = {this.totalPrice}
          onExitPress = {this.onExitPress}
          onConfirmPaymentPress = {this.onConfirmPaymentPress}
          onPaymentConfirmed = {this.onPaymentConfirmed}
        />
      );
    }
    else {
      return <View/>
    }
  }

  onModalLayout = (event) => {
    this.modalLayout = event.nativeEvent.layout;
  }

  @action onCheckoutPress = () => {
    this.checkoutModalVisible = true;
  }

  // render circles view for count
  renderItemCountView = (itemID) => {
    let itemCount = this.cart.get(itemID);
    if (itemCount <= 6) {
      dots = []
      for (var i = 0; i < itemCount; i++) {
        dots.push(<View key = {i} style = {styles.menuItemCounter}/>);
      }

      return (
        <View style = {styles.menuItemCountContainer}>
          {dots}
        </View>
      );
    }
    else {
      return (
        <View style = {styles.menuItemCountContainer}>
          <Text style = {styles.menuItemCountText}>{itemCount}</Text>
        </View>
      )
    }
  }

  onConfirmPaymentPress = () => new Promise(() => {

  })

  @action onPaymentConfirmed = () => {
    this.checkoutModalVisible = false;
    this.cart = new Map();
  }

  render() {
    // console.log("Rendering TruckView");
      // console.log(this.cart.numItems, this.cart.itemCounts, this.cart.totalPrice);
    return (
      <View style = {styles.container}>
        <Modal isVisible={this.modalVisible}
          onStartShouldSetResponder = {() => {return true}}
          onResponderRelease = {this.closeModal}
          onResponderTerminationRequest = {() => {return true}}>
          {this.renderItemModal()}
        </Modal>
        <Modal isVisible={this.checkoutModalVisible}>
          {this.renderCheckoutModal()}
        </Modal>
        <ScrollView style={styles.container}>
          <View style = {styles.imageContainer}>
            <Image style = {styles.image} source = {food_truck_img}>
            </Image>
          </View>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>{this.toTitleCase(this.props.truck.truck_name)} </Text>
            <CommunityIcon style = {styles.subtitleIcon} name = "silverware" size = {15} color = {GREEN}>
              <Text style = {styles.subtitleText}>  {this.toTitleCase(this.props.truck.cuisine)}</Text>
            </CommunityIcon>
            <CommunityIcon style = {styles.subtitleIcon} name = "walk" size = {15} color = {GREEN}>
              <Text style = {styles.subtitleText}>  4 min</Text>
            </CommunityIcon>
          </View>
          <View style = {styles.menuTitleContainer}>
            <Text style = {styles.menuTitleText}>Menu</Text>
          </View>
          {this.renderMenu()}
        </ScrollView>
        <View style = {styles.bottomTab}>
          <CommunityIcon style = {styles.subtitleIcon} name = "cash-usd" size = {15} color = {GREEN}>
            <Text style = {styles.subtitleText}>  {this.totalPrice}</Text>
          </CommunityIcon>
          <CommunityIcon style = {styles.subtitleIcon} name = "cart" size = {15} color = {GREEN}>
            <Text style = {styles.subtitleText}>  {this.totalItemCount}</Text>
          </CommunityIcon>
          <TouchableHighlight underlayColor = {DRK_GREEN} disabled = {this.totalPrice <= 0} onPress = {() => {this.totalPrice > 0 ? this.onCheckoutPress() : null}}
            style = {[styles.checkoutButton, {backgroundColor: this.totalItemCount > 0 ? GREEN : 'grey'}]}>
            <Text style = {styles.checkoutButtonText}>Checkout</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight underlayColor = {TRNS_GREEN} style = {styles.backButton} onPress = {() => {Actions.pop()}}>
          <Icon name = "arrow-back" size = {25} color = {GREEN} style = {styles.backButtonIcon}/>
        </TouchableHighlight>
        <TouchableHighlight underlayColor = {TRNS_GREEN} style = {styles.favButton} onPress = {() => {this.onFavPress()}}>
          <CommunityIcon name = {this.favPressed ? "heart" : "heart-outline"} size = {25} color = {GREEN} style = {styles.favButtonIcon}/>
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
    width: SCREEN.width,
    height: 250,
    top: 0,
  },
  image: {
    top: 0,
    flex: 1,
    resizeMode: Image.resizeMode.stretch,
    width: SCREEN.width,
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
    alignContent: 'center',
    justifyContent: 'center',
  },
  favButtonIcon: {
    width: 25,
    top: 1,
    alignSelf: 'center',
  },
  titleContainer: {
    flex: 1,
    width: SCREEN.width,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 40,
    marginLeft: 15,
    marginTop: 8,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuTitleContainer: {
    flex: 1,
    width: SCREEN.width,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
    paddingBottom: 10,
  },
  menuTitleText: {
    fontSize: 30,
    marginLeft: 15,
    marginTop: 8,
    fontFamily: 'Arial Rounded MT Bold',
  },
  subtitleText: {
    fontSize: 15,
    fontFamily: 'Arial Rounded MT Bold',
    color: 'black',
  },
  subtitleIcon: {
    marginLeft: 15,
  },
  map: {
    height: 250,
    width: SCREEN.width,
    flex: 1,
  },
  bottomTab: {
    height: 75,
    width: SCREEN.width,
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
  menuItem: {
    width: SCREEN.width,
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  menuItemName: {
    position: 'absolute',
    fontSize: 15,
    marginLeft: 40,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemPrice: {
    position: 'absolute',
    fontSize: 15,
    right: 5,
    color: GREEN,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemCountText: {
    fontSize: 15,
    color: GREEN,
    fontFamily: 'Arial Rounded MT Bold',
  },
  menuItemCountContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 25,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  menuItemCounter: {
    height: 5,
    width: 5,
    borderRadius: 2.5,
    backgroundColor: GREEN,
    margin: 1,
  },
});

// TruckView.propTypes = {
//   truck: PropTypes.shape({
//     menu: PropTypes.instanceOf(ObservableMap),
//     cuisine: PropTypes.string,
//     truck_name: PropTypes.string
//   }).isRequired,
//   onCheckoutPress: PropTypes.func.isRequired,
// }

/* Reserves

*/
