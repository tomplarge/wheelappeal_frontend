import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  ListView,
  TouchableHighlight
} from 'react-native';

const screen = Dimensions.get('window');
import Button from 'react-native-animated-button';
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView from 'react-native-maps';
//TODO: Fix .bind(this)

const GREEN = '#4fc29f'
const ORANGE = '#ffc33d'
const MENU_ITEMS_NUM = 3
const MENU_ITEM_HEIGHT = 50

export default class TruckView extends Component {
  constructor(props) {
    super(props);

    this.pressData = {}

    for (var i = 0; i < MENU_ITEMS_NUM; i++){
      this.pressData[i] = false;
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
    const dataSource = ds.cloneWithRows(this.generateRows(this.props.menu));


    console.log('made it here')
    this.state = {
      dataSource: dataSource,
    }
  }

  generateRows(menu) {
    var dataObj = [];
    for (var i = 0; i < MENU_ITEMS_NUM; i++) {
      rowObj = {text: menu[i].item, price: menu[i].price, id: menu[i].id, selected: this.pressData[i]};
      dataObj.push(rowObj);
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
    console.log(this.pressData)
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
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress = {this.props.onPress} style = {{top: 0, height: MENU_ITEM_HEIGHT, width:50, alignSelf:'center', justifyContent: 'center'}}>
          <Icon style = {{alignSelf:'center'}} size = {30} name = "arrow-drop-down-circle" color = {GREEN}/>
        </TouchableOpacity>
        <View style = {{height: MENU_ITEM_HEIGHT, borderBottomWidth: 2, borderColor: ORANGE, justifyContent: 'center'}}>
          <Text style = {{fontSize: 40, color: 'white', alignSelf:'center'}}> {this.props.truckName}  </Text>
        </View>
        <View style = {{height: 5*MENU_ITEM_HEIGHT, borderColor: ORANGE}}>
          <ListView
          dataSource={this.state.dataSource}
          renderRow = {this.renderRow.bind(this)}
          />
        </View>
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
    backgroundColor:'transparent',
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
    backgroundColor: 'red'
  },
  menuContainer: {
    height: screen.height/2,
    width: screen.width,
    backgroundColor: 'blue'
  },
  map: {
    backgroundColor: 'transparent',
    height: screen.height - (9*MENU_ITEM_HEIGHT)
  },
});
