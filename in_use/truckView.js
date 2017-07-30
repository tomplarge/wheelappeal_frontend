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

export default class TruckView extends Component {
  constructor(props) {
    super(props);
    // this.pressData = {}
    //
    // for (var i = 0; i < MENU_ITEMS_NUM; i++){
    //   this.pressData[i] = false;
    // }
    //
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
    // const dataSource = ds.cloneWithRows(this.generateRows(this.props.menu));
    this.state = {
      modalOpen: false,
    }
  }

  // generateRows(menu) {
  //   var dataObj = [];
  //   for (var i = 0; i < MENU_ITEMS_NUM; i++) {
  //     if (menu != undefined) {
  //       // lost menu.id
  //       rowObj = {text: menu[i].item, price: menu[i].price, id: i, selected: this.pressData[i]};
  //       dataObj.push(rowObj);
  //     }
  //   }
  //   return dataObj;
  // }

  // handlePress(row) {
  //   this.pressData[row.id] = !this.pressData[row.id];
  //   this.setState({dataSource: this.state.dataSource.cloneWithRows(
  //     this.generateRows(this.props.menu)
  //   )});
  // }
  //
  // renderRow(row) {
  //   var background = this.pressData[row.id] ? GREEN : 'white';
  //   return (
  //     <TouchableHighlight onPress = {() => {this.handlePress(row)}} style = {{height: MENU_ITEM_HEIGHT, backgroundColor:background, borderBottomWidth: 2, borderColor: 'black'}}>
  //       <View style = {{flex: 1, flexDirection:'row'}}>
  //         <Text style = {{alignSelf: 'center', left: 0}}> {row.text} </Text>
  //         <Text style = {{alignSelf: 'center', right: 0, position:'absolute'}}> {'Price: $'+row.price} </Text>
  //       </View>
  //     </TouchableHighlight>
  //   )
  // }
  onExitPress = () => {
    this.setState({
      modalOpen: false,
    })
  }

  onAddToCartPress = () => {
    this.setState({
      modalOpen: false,
    })
  }

  renderMenu() {
    return (
      <View>
        {this.props.menu.map((item, i) => (
          <TouchableHighlight key = {i} onPress = {() => {this.setState({modalOpen: true})}} style = {styles.menuItem}>
            <View style = {{}}>
              <Text style = {styles.menuItemName}> {item.item} </Text>
              <Text style = {styles.menuItemPrice}> {item.price} </Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    )
  }

  render() {
    if (this.props.truckName === null) {
      return null
    }
    else
      return (
        <View style = {styles.container}>
        <Modal isVisible={this.state.modalOpen}>
          <MenuItemModal
            itemName = {'Item Name'}
            onExitPress = {this.onExitPress}
            onAddToCartPress = {this.onAddToCartPress}
          />
        </Modal>
          <ScrollView style={styles.container}>
            <View style = {styles.imageContainer}>
              <Image style = {styles.image} source = {food_truck_img}>
              </Image>
            </View>
            <View style = {styles.titleContainer}>
              <Text style = {styles.titleText}> {this.props.truckName} </Text>
              <Text style = {styles.subtitleText}> Mexican </Text>
              <Text style = {styles.subtitleText}> 4 minute walk </Text>
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
              <Text style = {styles.titleText}> Menu </Text>
            </View>
            {this.renderMenu()}
          </ScrollView>
          <View style = {styles.bottomTab}>
            <Text style = {styles.cartText}> Current Price </Text>
            <Text style = {styles.cartText}> Num Items </Text>
            <TouchableHighlight onPress = {() => {console.log("Checkout")}} style = {styles.checkoutButton}>
              <Text style = {styles.checkoutButtonText}> Checkout </Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight style = {styles.backButton} onPress = {() => {console.log("Back")}}>
            <Icon name = "arrow-back" size = {25} color = {GREEN} style = {styles.backButtonIcon}/>
          </TouchableHighlight>
          <TouchableHighlight style = {styles.favButton} onPress = {() => {console.log("Fav")}}>
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
  },
  subtitleText: {
    fontSize: 15,
    left: 0,
  },
  map: {
    height: 250,
    width: screen.width,
    flex: 1,
  },
  bottomTab: {
    height: 75,
    width: screen.width,
    justifyContent: 'center'
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
    backgroundColor: GREEN,
  },
  checkoutButtonText: {
    fontSize: 15,
  },
  cartText: {
    left: 10,
    fontSize: 15,
    color: GREEN,
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
  menuItemPrice: {
    position: 'absolute',
    fontSize: 15,
    right: 5,
  }
});

/* Reserves

*/
