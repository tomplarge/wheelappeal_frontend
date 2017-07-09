/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow weak
 * @providesModule PanResponderExample
 */
'use strict';

import React, {Component} from 'react'
import {
  PanResponder,
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

const screen = Dimensions.get('window');

const previewBlockHeight = 100;
const previewBlockWidth = screen.width*7/10;
const previewBlockSpacing = 10;

export default class PreviewScrollItem extends Component{
  constructor(props){
    super(props);
    var _panResponder = {};
    var _previewStyles = {};
    var preview = (null : ?{ setNativeProps(props): void });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previewStyles = {
      style: {
        width: previewBlockWidth,
        height: previewBlockHeight,
        marginHorizontal: previewBlockSpacing,
        backgroundColor: 'green',
        overflow: 'hidden',
        borderRadius: 3,
        borderColor: '#000',
      }
    };
  }

  componentDidMount() {
    this._updateNativeStyles();
  }

  render() {
    return (
      <View>
        <View
          ref={(preview) => {
            this.preview = preview;
          }}
          style={styles.preview} {...this.props.containerStyle}
          {...this._panResponder.panHandlers}
        >
          <Text style = {this.props.textStyle}> {this.props.text} </Text>
        </View>
      </View>
    );
  }

  _highlight = () => {
    this._previewStyles.style.backgroundColor = 'blue';
    this._updateNativeStyles();
  }

  _unHighlight = () => {
    this._previewStyles.style.backgroundColor = 'green';
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.preview.setNativeProps(this._previewStyles);
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    // Should we become active when the user moves a touch over the circle?
    this._previewStyles.style.backgroundColor = 'green';
    this._updateNativeStyles();
  }

  _handlePanResponderGrant = (e, gestureState) => {
    this._highlight();
  }
  _handlePanResponderMove = (e, gestureState) => {
    // this._previewStyles.style.left = this._previousLeft + gestureState.dx;
    // this._previewStyles.style.top = this._previousTop + gestureState.dy;
    this._unHighlight()
  }
  _handlePanResponderEnd = (e, gestureState) => {
    if (this._previewStyles.style.backgroundColor == 'blue') {
      this._unHighlight()
      Actions.truck_view()
    }
  }
}

const styles = StyleSheet.create({
  preview: {
    width: previewBlockWidth,
    height: previewBlockHeight,
    marginHorizontal: previewBlockSpacing,
    backgroundColor: 'green',
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#000',
  },
});
