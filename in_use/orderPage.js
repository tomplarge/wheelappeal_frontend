import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight
} from 'react-native';


const GREEN = '#00d38e'
const ORANGE = '#ffb123'

export default class OrderPage extends Component {
  constructor(props) {
    super(props);
  }

  renderCart() {
    return (
      <View>
        {this.props.cart.map((item, i) => (
          <View key = {i} style = {styles.cartItemContainer}>
            <Text style = {styles.cartItemText}> Count </Text>
            <Text style = {styles.cartItemText}> Item </Text>
            <Text style = {styles.cartItemText}> Price </Text>
          </View>
        ))}
      </View>
    )
  }

  render(){
    return(
      <View style = {styles.container}>
        <View style = {styles.topTabBar}>
          <Text style = {styles.topTabBarText}> Your Order </Text>
        </View>
        <ScrollView style = {styles.container}>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}> Truck Name </Text>
            <Text style = {styles.subtitleText}> Wait Time: </Text>
          </View>
          {this.renderCart()}
        </ScrollView>
        <TouchableHighlight style = {styles.bottomTabBar}>
          <Text style = {styles.bottomTabBarText}> Order </Text>
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
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  titleText: {
    fontSize: 40,
  },
  subtitleText: {
    fontSize: 20,
  },
})
