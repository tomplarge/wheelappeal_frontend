import MapView from 'react-native-maps';
import React, {Component} from "react";
import TruckView from './truckView';
import SearchBar from 'react-native-searchbar';
import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Actions} from 'react-native-router-flux';
import {observer} from 'mobx-react';
import {observable, action} from "mobx";

import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Animated,
    FlatList,
    TouchableOpacity,
    ListView
} from "react-native";

// Global variables
const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const SCREEN = Dimensions.get('window');
const PREV_BLK_HEIGHT = 75;
const PREV_BLK_WIDTH = SCREEN.width*7/10;
const PREV_BLK_SPACING = 10;

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
  onCheckoutPress(cart) {
    // console.log(cart);
    Actions.pop();
    Actions.order({
      cart: cart,
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
                <Text style = {styles.previewBlockText}>{this.toTitleCase(item.truck_name)}</Text>
            </TouchableOpacity>
          }
        />
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
  previewBlock: {
      flex: 1,
      width: PREV_BLK_WIDTH,
      height: PREV_BLK_HEIGHT,
      marginHorizontal: PREV_BLK_SPACING,
      backgroundColor: GREEN,
      overflow: 'hidden',
      borderRadius: 5,
      borderColor: '#000',
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
  },
  previewBlockText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial Rounded MT Bold',
  },
  truckScroll: {
    width: SCREEN.width,
    bottom: 6,
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

/* Reserves
const FILTER_WIDTH = (SCREEN.width - 50)/3 - 10;
const FILTER_ITEM_HEIGHT = 30;

// use api for cuisine options?
const FILTER_OPTIONS = {
  'cuisine': ['mexican', 'chinese', 'american'],
  'price': ['$','$$','$$$','$$$$'],
  'waitTime':['0-5','5-10','10-15','15-20'],
}
@observable filters = {
  'cuisine': {
    key: 0,
    selected: null,
    open: false,
  },
  'price': {
    key: 1,
    selected: null,
    open: false,
  },
  'waitTime': {
    key: 2,
    selected: null,
    open: false,
  },
};
@observable filterOpen = false;

this.filterButtonPos = null;
// this can be consolidated
cuisineDefaultSelected = {}
for (var i = 0; i < FILTER_OPTIONS['cuisine'].length; i++) {
  cuisineDefaultSelected[FILTER_OPTIONS['cuisine'][i]] = false;
}

priceDefaultSelected = {}
for (var i = 0; i < FILTER_OPTIONS['price'].length; i++) {
  priceDefaultSelected[FILTER_OPTIONS['price'][i]] = false;
}

waitTimeDefaultSelected = {}
for (var i = 0; i < FILTER_OPTIONS['waitTime'].length; i++) {
  waitTimeDefaultSelected[FILTER_OPTIONS['waitTime'][i]] = false;
}

this.filters['cuisine'].selected = cuisineDefaultSelected;
this.filters['price'].selected = priceDefaultSelected;
this.filters['waitTime'].selected = waitTimeDefaultSelected;

var filterDs = {};
Object.keys(this.filters).forEach((filterName) => {
  filterDs[filterName] = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
  this.filterDataSource[filterName] = filterDs[filterName].cloneWithRows(this.generateFilterRows(this.filters, filterName));
})

generateFilterRows(filters, filterName) {
  var dataObj = [];
  optionsList = FILTER_OPTIONS[filterName]
  for (var i = 0; i < optionsList.length; i++) {
    optionName = optionsList[i]
    rowObj = {text: optionName, id: i, selected: filters[filterName].selected[optionName]};
    dataObj.push(rowObj);
  }
  return dataObj;
}

renderFilterRow(i, row) {
    return (
      <TouchableOpacity style={[styles.filterRow, {backgroundColor: row.selected ? GREEN : 'white'}]}
        onPress = {() => {this.handleFilterPress(row, i)}}>
        <Text> {row.text} </Text>
      </TouchableOpacity>
    )
}

handleFilterPress = (row, i) => {
  // gotta be a better way
  filterName = Object.keys(this.filters)[i];
  filter = this.filters[filterName];
  filter.selected[row.text] = !filter.selected[row.text];
  this.filterDataSource[filterName] = this.filterDataSource[filterName].cloneWithRows(this.generateFilterRows(this.filters, filterName));
  this.makeFilterHappen(filterName);
}

onFilterSelection = (filterName) => {
  this.filters[filterName].open = !this.filters[filterName].open;
}

need input? we don't want to search over every filter every time
filterName: 'cuisine', 'price', etc.
makeFilterHappen = (filterName) => {
  filterObj = this.filters[filterName]; //the object associated with cuisine, price, etc.
  selectedFilters = Object.keys(filterObj.selected).filter(el => filterObj.selected[el] == true)
  // this is linear just for testing - make it not
  // TODO: improve this!!
  var tempMarkers = []
  for (var i = 0; i < this.constMarkers.length; i++) {
    // also not a good way to check these things. Just for testing
    // TODO: improve this!!
    if (selectedFilters.find(selectedFilter => this.constMarkers[i].data.cuisine == selectedFilter) != undefined) {
      tempMarkers.push(this.constMarkers[i]);
    }
  }
  this.markers = tempMarkers;
}

renderFilterWindow() {
  if (this.filterOpen == true && this.filterButtonPos != null) {
    return (
      <View style = {[styles.filtersContainer, {width: SCREEN.width - this.filterButtonPos.x - this.filterButtonPos.width - 2*10,}]}
        pointerEvents = 'box-none'
      >
        {Object.keys(this.filters).map((filter, i) => (
          <View key = {i} style = {[styles.filtersListContainer, {height: this.filters[filter].open ? 110 : 0,}]}>
            <ListView
              dataSource = {this.filterDataSource[filter]}
              renderRow = {this.renderFilterRow.bind(this, i)}
            />
          </View>
        ))}
        <View style = {[styles.filterTypeContainer, {width: SCREEN.width - this.filterButtonPos.x - this.filterButtonPos.width - 2*10, height: this.filterButtonPos.height,}]}
        >
          <TouchableOpacity style = {styles.filterTypeSelect}
            onPress={() => {this.onFilterSelection('cuisine')}}>
            <Text style = {styles.filterTypeText}>Cuisine</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.filterTypeSelect}
          onPress={() => {this.onFilterSelection('price')}}>
            <Text style = {styles.filterTypeText}>Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.filterTypeSelect}
            onPress={() => {this.onFilterSelection('waitTime')}}>
            <Text style = {styles.filterTypeText}>Wait Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  else {
    return;
  }
}

filterTypeSelect: {
  borderRadius: 3,
  width: FILTER_WIDTH,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
},
filterSelect: {

},
filterTypeText: {
  color: GREEN,
},
filterTypeContainer: {
  position: 'absolute',
  left: 0,
  bottom: 0,
  borderRadius: 3,
  flex: 1,
  backgroundColor: 'transparent',
  flexDirection: 'row',
  justifyContent: 'space-between',
},
filtersListContainer: {
  backgroundColor: 'white',
  width: FILTER_WIDTH,
  top: 0,
  borderRadius: 3,
},
filtersContainer: {
  flex: 1,
  height: 150,
  justifyContent:'space-between',
  backgroundColor: 'transparent',
  bottom: 10+PREV_BLK_HEIGHT,
  position: 'absolute',
  right: 10,
  flexDirection: 'row',
},
filterRow: {
  borderRadius: 1,
  borderBottomWidth: 2,
  borderColor: GREEN,
  height: FILTER_ITEM_HEIGHT,
  justifyContent:'center',
  alignItems:'center',
},
*/
