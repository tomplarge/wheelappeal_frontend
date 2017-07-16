import MapView from 'react-native-maps';
import React, {Component} from "react";
import TruckView from './truck_view';
import SearchBar from 'react-native-searchbar';
import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import Callout from "react-native-callout";

//import PreviewPanController from './PreviewPanController'
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

const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const screen = Dimensions.get('window');
const NUM_FILTERS = 3;
const FILTER_WIDTH = (screen.width - 50)/3 - 10;

// use api for cuisine options?
const FILTER_OPTIONS = {
  'cuisine': ['mexican', 'chinese', 'american'],
  'price': ['$','$$','$$$','$$$$'],
  'waitTime':['0-5','5-10','10-15','15-20'],
}

const FILTER_ITEM_HEIGHT = 30;

const previewBlockHeight = 75;
const previewBlockWidth = screen.width*7/10;
const previewBlockSpacing = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    backgroundColor: 'transparent',
    flex: 1
  },

  previewBlockContainer: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'relative',
    //top: screen.height - previewBlockHeight,
  },

  previewBlock: {
      flex: 1,
      //justifyContent: 'center',
      width: previewBlockWidth,
      height: previewBlockHeight,
      marginHorizontal: previewBlockSpacing,
      backgroundColor: GREEN,
      overflow: 'hidden',
      borderRadius: 3,
      borderColor: '#000',
      borderWidth: 0,
  },
});

export default class MapPage extends Component {
  constructor(props) {
    super(props);

    this.filterButtonPos = null;

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

    filters = {
      'cuisine': {
        key: 0,
        selected: cuisineDefaultSelected,
        open: false,
      },
      'price': {
        key: 1,
        selected: priceDefaultSelected,
        open: false,
      },
      'waitTime': {
        key: 2,
        selected: waitTimeDefaultSelected,
        open: false,
      },
    };

    filterDs = {}
    filterDataSource = {}
    console.log(Object.keys(filters))
    Object.keys(filters).forEach((filterName) => {
      filterDs[filterName] = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
      filterDataSource[filterName] = filterDs[filterName].cloneWithRows(this.generateFilterRows(filters, filterName));
    })
    console.log(filterDataSource)

    this.state = {
      truckIndex: null,
      modalOpen: false,
      filterOpen: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      truckData: [],
      results: [],
      searchBarVisible: false,
      filters: filters,
      filterDs: filterDs,
      filterDataSource: filterDataSource,
    }
  }

  onRegionChange = (reg) => {
    this.setState({region: reg});
  }

  componentWillMount() {
    this.setState({modalOpen: false});
    fetch('http://wheelappeal.co:5000/v1/trucks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json()) // returns a promise
    .then((responseJSON) => {this.setTruckData(responseJSON)}) // JSON promise handled here

    // this is algorithmically slow - change when we get real data
    // Also, might be handling these promises in a weird way.
    .then(() => {
      this.state.truckData.map((truckdata, i) => {
        fetch('http://wheelappeal.co:5000/v1/menu?truckname='+truckdata.name.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((responseJSON) => {this.setMenu(i, responseJSON)})
      })
    })
  }

  componentDidMount = () => {
    this.setCurrentLocation();
  }

  setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
      {
        this.setState({
          region:
          {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0922
          },
        });
        if (this.map) {
          this.map.region = this.state.region;
        }
    });
  }

  setTruckData = (response) => {
    console.log('Setting Truck Data')
    this.setState({
      truckData: response
    })
    this.setMarkers();
  }

  setMarkers = () => {
    console.log('Setting Markers')
    this.setState({
      markers: [
        {
          key:0,
          data: this.state.truckData[0],
          coordinate: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
        },
        {
          key:1,
          data: this.state.truckData[1],
          coordinate: {
            latitude: LATITUDE + 0.01,
            longitude: LONGITUDE - 0.01,
          },
        },
        {
          key:2,
          data: this.state.truckData[2],
          coordinate: {
            latitude: LATITUDE - 0.01,
            longitude: LONGITUDE - 0.01,
          },
        },
      ]
    });
  }

  setMenu = (idx, menu) => {
    console.log('Setting Menu for Truck ' + idx)
    this.state.truckData[idx].menu = menu
  }

  // there might be a system string operation for multiplication
  priceText(num) {
    str = "";
    for (var i = 0; i < num; i++){
      str += "$";
    }
    return str;
  }

  handleSearchResults = (results) => {
    this.setState({results: results})
  }

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
      <TouchableOpacity style={{borderRadius: 2, borderColor: GREEN, borderWidth: 1, height:FILTER_ITEM_HEIGHT, justifyContent:'center',alignItems:'center', backgroundColor: row.selected ? GREEN : 'white'}}
        onPress = {() => {this.handleFilterPress(row, i)}}>
        <Text> {row.text} </Text>
      </TouchableOpacity>
    )
  }

  handleFilterPress(row, i) {
    let {filters, filterDataSource} = this.state;
    // gotta be a better way
    filterName = Object.keys(filters)[i];
    console.log('filterName:',filterName)
    filter = filters[filterName];
    filter.selected[row.text] = !filter.selected[row.text];
    console.log('filterDataSource:',this.state.filterDataSource[filterName])
    filterDataSource[filterName] = this.state.filterDataSource[filterName].cloneWithRows(this.generateFilterRows(filters, filterName));
    this.setState({filters: filters, filterDataSource: filterDataSource});
  }

  renderFilterWindow() {
    //console.log(this.filterButton.getItemLayout())
    if (this.state.filterOpen == true && this.filterButtonPos != null) {
      return (
        <View style = {{flex: 1, height: 150, justifyContent:'space-between', backgroundColor: 'transparent', top: this.filterButtonPos.y - 110, position: 'absolute', width: screen.width - this.filterButtonPos.x - this.filterButtonPos.width - 2*10, right: 10, flexDirection: 'row'}}
          pointerEvents = 'box-none'
        >
          {Object.keys(this.state.filters).map((filter, i) => (
            <View key = {i} style = {{backgroundColor: 'white', height: this.state.filters[filter].open ? 110 : 0, width: FILTER_WIDTH, top: 0, borderRadius: 3}}>
              <ListView
                dataSource = {this.state.filterDataSource[filter]}
                renderRow = {this.renderFilterRow.bind(this, i)}
              />
            </View>
          ))}
          <View style = {{
            width: screen.width - this.filterButtonPos.x - this.filterButtonPos.width - 2*10,
            height: this.filterButtonPos.height,
            position: 'absolute',
            left: 0,
            // top: this.filterButtonPos.y,
            bottom: 0,
            borderRadius: 3,
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          >
            <TouchableOpacity style = {{borderRadius: 3, width: FILTER_WIDTH, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {let {filters} = this.state; filters['cuisine'].open = !filters['cuisine'].open; this.setState({filters: filters})}}>
              <Text> Cuisine </Text>
            </TouchableOpacity>
            <TouchableOpacity style = {{borderRadius: 3, width: FILTER_WIDTH, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {let {filters} = this.state; filters['price'].open = !filters['price'].open; this.setState({filters: filters})}}>
              <Text> Price </Text>
            </TouchableOpacity>
            <TouchableOpacity style = {{borderRadius: 3, width: FILTER_WIDTH, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {let {filters} = this.state; filters['waitTime'].open = !filters['waitTime'].open; this.setState({filters: filters})}}>
              <Text> Wait Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else {
      return;
    }
  }

  render() {
    const {
      markers,
    } = this.state;
    return (
      <View style = {styles.container}>
      <Modal isVisible={this.state.modalOpen} style = {{top: 0}}>
        <TruckView
          truckName = {this.state.truckIndex === null ? null : this.state.truckData[this.state.truckIndex]['name']}
          onPress = {() => {this.setState({modalOpen: false})}}
          menu = {this.state.truckIndex === null ? null : this.state.truckData[this.state.truckIndex]['menu']}
          marker = {this.state.truckIndex === null ? null : markers[this.state.truckIndex]}
          region = {this.state.region}
        />
      </Modal>
        <SearchBar
          ref={(ref) => this.searchbar = ref}
          placeholder = {'Search Food Trucks'}
          data = {this.state.truckData}
          handleResults = {this.handleSearchResults}
          onHide = {() => {this.setState({searchBarVisible: false})}}
        />
        <MapView
          ref={map => this.map = map}
          showsUserLocation
          style={ styles.map }
          region={this.state.region}
          onRegionChange={(reg) => {this.onRegionChange(reg)}}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              ref = {'marker'+marker.key}
              key = {marker.key}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress = {() => {this.list.scrollToIndex({index: marker.key})}}>
              <MapView.Callout>
                <View>
                  <Text style = {{fontSize: 15, color: ORANGE}}> {marker.data.name} </Text>
                  <Text style = {{fontSize: 10, color: ORANGE}}> Cuisine: {marker.data.cuisine}</Text>
                  <Text style = {{fontSize: 10, color: ORANGE}}> Price: {this.priceText(marker.data.price)} </Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
            ))}
        </MapView>
        {this.renderFilterWindow()}
        <TouchableOpacity style={{top: 20, left: 10, position: 'absolute', height: 50, width: 50, borderRadius: 10, backgroundColor:GREEN, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {this.setState({searchBarVisible: true}); this.searchbar.show()}}>
          <Icon name = "search" size = {30} color = {'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{top: 20, right: 10, position: 'absolute', height: 50, width: 50, borderRadius: 10, backgroundColor:GREEN, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            this.setCurrentLocation()
          }}>
          <Icon name = "my-location" size = {30} color = {'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style = {{left: 10, bottom: 6+previewBlockHeight+10, position:'absolute', height: 35, width: 35, borderRadius: 10, backgroundColor: GREEN, justifyContent: 'center', alignItems: 'center'}}
          ref = {ref => this.filterButton = ref} onPress = {() => {this.setState({filterOpen: !this.state.filterOpen})}}
          onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            this.filterButtonPos = {x,y,width,height};
          }}
        >
          <CommunityIcon name = "filter-outline" size = {20} color = {'white'}/>
        </TouchableOpacity>
        <FlatList
          ref={list => this.list = list}
          style = {{
            bottom: 6,
            position: 'absolute',
          }}
          horizontal={true}
          data={markers}
          getItemLayout = {(data,index) => (
            {length: previewBlockWidth, offset: (previewBlockWidth+2*previewBlockSpacing)*index, index}
          )}
          renderItem={({item}) =>
            <TouchableOpacity
              onPress={() => {this.setState({modalOpen: true, truckIndex: item.key})}}
              //onPress = {() => {this.map.animateToRegion(item.coordinate, 2); this.refs['marker'+item.key].showCallout()}}
              style = {styles.previewBlock}>
                  <Icon style = {{alignSelf:'center', top: 0, transform: [{ rotate: '180deg'}], color: 'white'}} size = {20} name = "arrow-drop-down-circle"/>
                  <Text style = {{alignSelf: 'center', fontSize: 20, color: 'white', fontWeight: 'bold'}}> {this.state.truckData[item.key].name} </Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}
