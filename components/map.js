import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Animated,
    FlatList,
    TouchableOpacity,
    ListView,
    Image,
} from "react-native";

import MapView from 'react-native-maps';
import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Actions} from 'react-native-router-flux';
import {observer} from 'mobx-react';
import {observable, action, toJS} from "mobx";
import PropTypes from 'prop-types';

// import stores
import TruckStore from '../stores/truckStore';
import SearchBar from './searchBar';

// Global variables
const GREEN = '#00d38e'
const TRNS_GREEN = '#00d38e80';
const ORANGE = '#ffb123'
const SCREEN = Dimensions.get('window');
const PREV_BLK_HEIGHT = 150;
const PREV_BLK_WIDTH = SCREEN.width*7/10;
const PREV_BLK_SPACING = 0;
const food_truck_img = require('./food-truck-img.jpg');

@observer export default class MapPage extends Component {
  @observable searchResultsView;
  @observable searching;
  @observable truckData;
  @observable markers = [];
  @observable region;
  @observable toggle = 'map';
  scrollResponder;

  constructor(props) {
    super(props);

    // instantiate observable truckData
    this.truckData = this.props.truckStore.truckData;
  }

  componentWillMount() {
    // set current location when component will mount
    this.setCurrentLocation();
  }

  componentDidMount() {
    this.scrollResponder = this.truckList.getScrollResponder();
  }

  // centers map at user location
  // TODO move this to user store
  @action setCurrentLocation = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.region = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0922
          };
      });
    } catch(error) {
      console.log(error)
      this.region = {
        longitude: -122.4324,
        latitude: 37.78825,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0922
      };
    }
  }

  // returns dollar sign count for truck price
  priceText(num) {
    str = "";
    for (var i = 0; i < num; i++){
      str += "$";
    }

    return str;
  }

  // returns capitalized string
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  // open truckView component with props
  openTruckView = (truck) => {
    Actions.truck({
      truck: truck,
      region: this.region,
      onCheckoutPress: this.onCheckoutPress,
    });
  }

  // callback function for when user presses checkout
  onCheckoutPress(cart, truck) {
    // console.log(cart);
    Actions.pop();
    Actions.order({
      cart: cart,
      truck: truck
    });
  }

  @action onTogglePress = (toggle) => {
    this.toggle = toggle;
  }

  searchFriendlyTruckData = () => {
    let tmpArray = [];
    this.props.truckStore.truckData.forEach((truck, truck_id) => {
      let tmp = {
        ...truck,
        menu: truck.menu.values()
      }
      tmpArray.push(tmp);
    });
    console.log('tmp:',tmpArray);
    return tmpArray;
  }

  render() {
      return (
        <View style = {styles.container}>
          <MapView
            ref={map => this.map = map}
            showsUserLocation
            style={styles.map}
            region={this.region}
            onMapReady = {() => {this.setCurrentLocation()}}
          >
            {this.props.truckStore.markers.map(marker => (
              <MapView.Marker
                ref = {'marker' + marker.key}
                key = {marker.key}
                coordinate={marker.coordinate}
                title={marker.title}
                onPress = {() => {this.truckList.scrollToIndex({index: marker.index})}}>
                <MapView.Callout>
                  <View>
                    <Text style = {styles.pinCalloutText}>{this.toTitleCase(marker.data.truck_name)}</Text>
                    <Text style = {styles.pinCalloutText}>Cuisine: {marker.data.cuisine}</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
              ))}
          </MapView>
          <TouchableOpacity style={styles.locationButton}
            onPress={() => {
              this.setCurrentLocation()
            }}>
            <Icon name = "my-location" size = {20} color = {'white'}/>
          </TouchableOpacity>
          <View style = {styles.toggleContainer}>
            <TouchableOpacity style={[styles.listButton, {backgroundColor: this.toggle == 'list' ? GREEN : 'white'}]} onPress = {() => this.onTogglePress('list')}>
              <Icon name = "list" size = {25} color = {this.toggle == 'list' ? 'white' : GREEN}/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mapButton, {backgroundColor: this.toggle == 'map' ? GREEN : 'white'}]} onPress = {() => this.onTogglePress('map')}>
              <Icon name = "map" size = {25} color = {this.toggle == 'map' ? 'white' : GREEN}/>
            </TouchableOpacity>
          </View>
          <View style = {styles.listContainer}>
            <FlatList
              ref={list => {this.truckList = list}}
              style = {styles.truckScroll}
              horizontal={true}
              data={this.props.truckStore.truckData}
              getItemLayout = {(data, index) => (
                {length: PREV_BLK_WIDTH, offset: (PREV_BLK_WIDTH + 2 * PREV_BLK_SPACING) * index, index}
              )}
              ItemSeparatorComponent = {() =>{return (<View style = {{backgroundColor: GREEN, height: PREV_BLK_HEIGHT - 20, width: 1, top: 10, position: 'absolute', right: 0}}/>)}}
              renderItem={({item}) =>
                <TouchableOpacity
                  onPress={() => {this.openTruckView(item)}}
                  style = {styles.previewBlock}>
                    <Image source = {food_truck_img} style = {styles.previewBlockImage}/>
                    <View style = {[styles.previewBlock, {backgroundColor: 'rgba(0,0,0,0.35)', height: PREV_BLK_HEIGHT - 20, width: PREV_BLK_WIDTH - 20}]}>
                      <Text style = {styles.previewBlockTitleText}>{this.toTitleCase(item.truck_name)}</Text>
                      <Text style = {styles.previewBlockSubtitleText}>{this.toTitleCase(item.cuisine)}</Text>
                    </View>
                  </TouchableOpacity>
              }
            />
          </View>
          <SearchBar
            ref={(ref) => this.searchbar = ref}
            placeholder = {'Search...'}
            data = {this.searchFriendlyTruckData()}
            autoCorrect = {false}
            handleResultSelect = {(rowData) => this.openTruckView(rowData)}
          />
        </View>
    );
  }
}

MapPage.propTypes = {
  truckStore: PropTypes.instanceOf(TruckStore).isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  previewBlockContainer: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'relative',
    //top: SCREEN.height - PREV_BLK_HEIGHT,
  },
  listContainer: {
    height: PREV_BLK_HEIGHT,
  },
  previewBlock: {
      width: PREV_BLK_WIDTH,
      height: PREV_BLK_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
  },
  previewBlockTitleText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    backgroundColor: 'transparent',
    letterSpacing: 4,
  },
  previewBlockSubtitleText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    backgroundColor: 'transparent',
  },
  previewBlockImage: {
    position: 'absolute',
    resizeMode: Image.resizeMode.stretch,
    width: PREV_BLK_WIDTH - 20,
    height: PREV_BLK_HEIGHT - 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckScroll: {
    width: SCREEN.width,
    bottom: 0,
    position: 'absolute',
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  filterButton: {
    left: 10,
    bottom: 10+PREV_BLK_HEIGHT,
    position:'absolute',
    height: 35,
    width: 35,
    borderRadius: 10,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: PREV_BLK_HEIGHT + 10,
    right: 10,
    height: 35,
    width: 35,
    borderRadius: 4,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    position: 'absolute',
    top: 25,
    right: 15,
    height: 70,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center'
  },
  listButton: {
    width: 40,
    height: 35,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  mapButton: {
    width: 40,
    height: 35,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  searchButton: {
    top: 20,
    left: 10,
    position: 'absolute',
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor:GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCalloutText: {
    fontSize: 15,
    color: GREEN,
    fontFamily: 'Arial Rounded MT Bold',
  },
});

/*
<TouchableOpacity style={styles.searchButton}
  onPress={() => {this.searchbar.show()}}>
  <Icon name = "search" size = {30} color = {'white'}/>
</TouchableOpacity>
*/
