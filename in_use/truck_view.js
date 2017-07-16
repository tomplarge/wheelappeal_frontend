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
  Image
} from 'react-native';

const screen = Dimensions.get('window');
import Button from 'react-native-animated-button';
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView from 'react-native-maps';
//TODO: Fix .bind(this)

const GREEN = '#00d38e'
const ORANGE = '#ffb123'
const MENU_ITEMS_NUM = 3
const MENU_ITEM_HEIGHT = 50
const food_truck_img = require('./food-truck-img.jpg')

export default class TruckView extends Component {
  constructor(props) {
    super(props);

    this.pressData = {}

    for (var i = 0; i < MENU_ITEMS_NUM; i++){
      this.pressData[i] = false;
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
    const dataSource = ds.cloneWithRows(this.generateRows(this.props.menu));

    this.state = {
      dataSource: dataSource,
    }
  }

  generateRows(menu) {
    var dataObj = [];
    for (var i = 0; i < MENU_ITEMS_NUM; i++) {
      if (menu != undefined) {
        // lost menu.id
        rowObj = {text: menu[i].item, price: menu[i].price, id: i, selected: this.pressData[i]};
        dataObj.push(rowObj);
      }
    }
    return dataObj;
  }

  handlePress(pressData, row) {
    this.pressData[row.id] = !this.pressData[row.id];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this.generateRows(this.props.menu)
    )});

  }
  renderRow(row) {
    var background = this.pressData[row.id] ? GREEN : 'white';
    return (
      <TouchableHighlight onPress = {() => {this.handlePress(this.pressData, row)}} style = {{height: MENU_ITEM_HEIGHT, backgroundColor:background, borderBottomWidth: 2, borderColor: 'black'}}>
        <View style = {{flex: 1, flexDirection:'row'}}>
          <Text style = {{alignSelf: 'center', left: 0}}> {row.text} </Text>
          <Text style = {{alignSelf: 'center', right: 0, position:'absolute'}}> {'Price: $'+row.price} </Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    if (this.props.truckName === null) {
      return null
    }
    else
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress = {this.props.onPress} style = {{top: 0, height: MENU_ITEM_HEIGHT, width:50, alignSelf:'center', justifyContent: 'center'}}>
            <Icon style = {{alignSelf:'center'}} size = {30} name = "arrow-drop-down-circle" color = {GREEN}/>
          </TouchableOpacity>
          <View style = {{height: MENU_ITEM_HEIGHT, borderBottomWidth: 2, borderColor: ORANGE, justifyContent: 'center'}}>
            <Text style = {{fontSize: 40, color: 'white', alignSelf:'center'}}> {this.props.truckName}  </Text>
          </View>
          <View style = {{height: screen.height - (9*MENU_ITEM_HEIGHT),justifyContent:'center',alignItems:'center', backgroundColor: 'red',overflow: 'hidden'}}>
            <Image style = {styles.image} source = {food_truck_img} />
          </View>
          <View style = {{height: 5*MENU_ITEM_HEIGHT, borderColor: ORANGE}}>
            <ListView
            dataSource={this.state.dataSource}
            renderRow = {this.renderRow.bind(this)}
            />
          </View>
          <TouchableOpacity style = {{backgroundColor: GREEN, justifyContent: 'center', height: MENU_ITEM_HEIGHT}}>
            <Text style = {{alignSelf: 'center', color: ORANGE, fontWeight: 'bold'}}> Order! </Text>
          </TouchableOpacity>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:ORANGE,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ORANGE
  },
  titleText: {
    fontSize: 40,
    alignSelf:'center'
  },
  titleContainer: {
    height: screen.height/8,
    width: screen.width,
  },
  menuContainer: {
    height: screen.height/2,
    width: screen.width,
    backgroundColor: 'blue'
  },
  image: {
    //height: screen.height - (9*MENU_ITEM_HEIGHT),
    //width: screen.width - 20,
    flex: 1,
    alignSelf:'center',
    resizeMode: ('contain','cover'),
    position: 'relative',
    overflow:'hidden'
  },
});

/* Reserves
<MapView
  showsUserLocation
  style={ styles.map }
  region={this.props.region}
  scrollEnabled={false}
  zoomEnabled={false  }
>
  <MapView.Marker
    key = {this.props.marker.key}
    coordinate={this.props.marker.coordinate}
  />
</MapView>
*/
