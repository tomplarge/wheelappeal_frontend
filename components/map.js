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
    Image
} from "react-native";

import MapView from 'react-native-maps';
import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Actions} from 'react-native-router-flux';
import {observer} from 'mobx-react';
import {observable, action} from "mobx";
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
  @observable searchBarVisible = false;
  @observable searchResultsView;
  @observable truckData;
  @observable markers = [];
  @observable region;

  constructor(props) {
    super(props);

    // instantiate observable truckData
    this.truckData = this.props.truckStore.truckData;

    // initialize search results listview datasource
    this.searchResultsDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
  }

  componentWillMount() {
    // set current location when component will mount
    this.setCurrentLocation();
  }

  // centers map at user location
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
    console.log('ACtion:', Actions)
    Actions.order({
      cart: cart,
      truck: truck
    });
  }

  // renders clickable search result row
  renderSearchResultRow = (rowData) => {
    return (
      <TouchableOpacity style = {styles.searchResultRow} onPress = {() => {this.openTruckView(rowData)}}>
        <Text style = {styles.searchResultText}>{this.toTitleCase(rowData.truck_name)}</Text>
      </TouchableOpacity>
    );
  }

  // processes search results
  // creates list view to hold search result rows
  @action handleSearchResults = (results) => {
    if (results) {
      this.searchResultsDataSource = this.searchResultsDs.cloneWithRows(results)
      // TODO: this will definitely need changing on Android
      this.searchResultsView = (
        <ListView style = {styles.searchResultsContainer}
          dataSource = {this.searchResultsDataSource}
          renderRow = {(rowData) => this.renderSearchResultRow(rowData)}
          keyboardShouldPersistTaps="always"
          enableEmptySections
        />
      );
    }
  }

  // clear search results view
  @action clearSearchResultsView = () => {
    this.searchResultsView = null;
  }

  render() {
    return (
      <View style = {styles.container}>
        <MapView
          ref={map => this.map = map}
          onPress = {() => {this.searchbar && this.searchbar.hide()}}
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
        <TouchableOpacity style={styles.searchButton}
          onPress={() => {this.searchbar.show()}}>
          <Icon name = "search" size = {30} color = {'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationButton}
          onPress={() => {
            this.setCurrentLocation()
          }}>
          <Icon name = "my-location" size = {30} color = {'white'}/>
        </TouchableOpacity>
        <View style = {styles.listContainer}>
          <SearchBar
            style = {{backgroundColor: 'red', top: 0}}
            showOnLoad
            iconColor = {GREEN}
          />
          <FlatList
            ref={list => this.truckList = list}
            style = {styles.truckScroll}
            horizontal={true}
            data={this.props.truckStore.truckData}
            getItemLayout = {(data,index) => (
              {length: PREV_BLK_WIDTH, offset: (PREV_BLK_WIDTH + 2 * PREV_BLK_SPACING) * index, index}
            )}
            renderItem={({item}) =>
              <TouchableOpacity
                onPress={() => this.openTruckView(item)}
                style = {styles.previewBlock}>
                  <Image source = {food_truck_img} style = {styles.previewBlockImage}/>
                  <View style = {[styles.previewBlock, {backgroundColor: 'rgba(0,0,0,0.35)'}]}>
                    <Text style = {styles.previewBlockTitleText}>{this.toTitleCase(item.truck_name)}</Text>
                    <Text style = {styles.previewBlockSubtitleText}>{this.toTitleCase(item.cuisine)}</Text>
                  </View>
                </TouchableOpacity>
            }
          />
        </View>
        <View style = {{flex: 1, top: 0, position: 'absolute'}}>
          <SearchBar
            style = {{backgroundColor: 'red'}}
            ref={(ref) => this.searchbar = ref}
            placeholder = {'Search Food Trucks'}
            data = {this.props.truckStore.truckData.slice()}
            handleResults = {this.handleSearchResults}
            onHide = {this.clearSearchResultsView}
          />
          {this.searchResultsView}
        </View>
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
    backgroundColor: 'white',
    height: 200,
  },
  previewBlock: {
      flex: 1,
      width: PREV_BLK_WIDTH,
      height: PREV_BLK_HEIGHT,
      overflow: 'hidden',
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
    width: PREV_BLK_WIDTH,
    height: PREV_BLK_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckScroll: {
    width: SCREEN.width,
    bottom: 0,
    position: 'absolute',
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
    top: 20,
    right: 10,
    position: 'absolute',
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor:GREEN,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchResultsContainer: {
    top: 72, // definitely will break on android
    width: SCREEN.width,
    flex: 1,
  },
  searchResultText: {
    fontSize: 20,
    color: GREEN,
    left: 0,
    margin: 5,
    fontFamily: 'Arial Rounded MT Bold',
  },
  searchResultRow: {
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
});
