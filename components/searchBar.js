import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  ListView,
  Image
} from 'react-native';
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { filter, some, includes } from 'lodash/collection';
import { debounce } from 'lodash/function';
import {observer} from 'mobx-react';
import {observable, action} from "mobx";

// const INITIAL_TOP = Platform.OS === 'ios' ? -80 : -60;
const INITIAL_TOP = 20;
const GREEN = '#00de8e';
const food_truck_img = require('./food-truck-img.jpg');

@observer export default class Search extends Component {
  @observable iconName =  "search";
  @observable input = '';
  @observable searchButtonSelected = 'nearby';
  @observable searchbarTop = new Animated.Value(45);
  @observable searchbarWidth = new Animated.Value(225);
  @observable searchbarHeight = new Animated.Value(30);
  @observable resultsListView;
  @observable resultsViewH = new Animated.Value(0);

  static propTypes = {
    data: PropTypes.array,
    placeholder: PropTypes.string,
    handleChangeText: PropTypes.func,
    handleSearch: PropTypes.func,
    handleResults: PropTypes.func,
    handleResultSelect: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onHide: PropTypes.func,
    onBack: PropTypes.func,
    onX: PropTypes.func,
    backButton: PropTypes.object,
    backButtonAccessibilityLabel: PropTypes.string,
    closeButton: PropTypes.object,
    closeButtonAccessibilityLabel: PropTypes.string,
    backCloseSize: PropTypes.number,
    fontSize: PropTypes.number,
    heightAdjust: PropTypes.number,
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    textColor: PropTypes.string,
    selectionColor: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    showOnLoad: PropTypes.bool,
    hideBack: PropTypes.bool,
    hideX: PropTypes.bool,
    iOSPadding: PropTypes.bool,
    iOSHideShadow: PropTypes.bool,
    clearOnShow: PropTypes.bool,
    clearOnHide: PropTypes.bool,
    clearOnBlur: PropTypes.bool,
    focusOnLayout: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    keyboardAppearance: PropTypes.string,
    fontFamily: PropTypes.string,
    allDataOnEmptySearch: PropTypes.bool,
  }

  static defaultProps = {
    data: [],
    placeholder: 'Search',
    backButtonAccessibilityLabel: 'Navigate up',
    closeButtonAccessibilityLabel: 'Clear search text',
    heightAdjust: 0,
    backgroundColor: 'white',
    iconColor: 'gray',
    textColor: 'gray',
    selectionColor: 'lightskyblue',
    placeholderTextColor: 'lightgray',
    animate: true,
    animationDuration: 200,
    showOnLoad: false,
    hideBack: false,
    hideX: false,
    iOSPadding: true,
    iOSHideShadow: false,
    clearOnShow: false,
    clearOnHide: true,
    clearOnBlur: false,
    focusOnLayout: false,
    autoCorrect: true,
    autoCapitalize: 'sentences',
    keyboardAppearance: 'default',
    fontFamily: 'System',
    allDataOnEmptySearch: false,
    backCloseSize: 28,
    fontSize: 20
  }

  constructor(props) {
    super(props);

    // initialize search results listview datasource
    this.searchResultsDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.selected !== r2.selected});
  }

  getValue = () => {
    return this.input;
  }

  // @action show = () => {
  //   const { animate, animationDuration, clearOnShow } = this.props;
  //   if (clearOnShow) {
  //     this.input = '';
  //   }
  //   this.setState({ show: true });
  //   if (animate) {
  //     Animated.timing(
  //       this.top, {
  //           toValue: 0,
  //           duration: animationDuration,
  //       }
  //     ).start();
  //   } else {
  //     this.setState({ top: new Animated.Value(0) });
  //   }
  // }

  _handleX = () => {
    const { onX } = this.props;
    this._clearInput();

    if (onX) onX()

  }

  _handleBack = () => {
    this.iconName = "search";
    this.textInput.blur();
    this._clearInput();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.searchbarTop, {
          toValue: 45,
          duration: 125,
        }),
        Animated.timing(this.searchbarWidth, {
          toValue: 225,
          duration: 125
        }),
        Animated.timing(this.searchbarHeight, {
          toValue: 30,
          duration: 125
        }),
      ]),
      Animated.timing(this.resultsViewH, {
        toValue: 0,
        duration: 125
      })
    ]).start();
  }

  _handleBlur = () => {
    const { onBlur, clearOnBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
    if (clearOnBlur) {
      this._clearInput();
    }
  }

  _clearInput = () => {
    this.input = '';
    this._onChangeText('');
  }

  _onChangeText = (input) => {
    const { handleChangeText, handleSearch, handleResults } = this.props;
    this.input = input;
    if (handleChangeText) {
      handleChangeText(input);
    }
    if (handleSearch) {
      handleSearch(input);
    } else {
      debounce(() => {
        // use internal search logic (depth first)!
        const results = this._internalSearch(input);
        this.handleResults(results);
      }, 500)();
    }
  }

  _internalSearch = (input) => {
    const { data, allDataOnEmptySearch } = this.props;
    if (input === '') {
      return allDataOnEmptySearch ? data : [];
    }
    return filter(data, (item) => {
      return this._depthFirstSearch(item, input);
    });
  }

  _depthFirstSearch = (collection, input) => {
    // let's get recursive boi
    let type = typeof collection;
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return includes(collection.toString().toLowerCase(), input.toString().toLowerCase());
    }
    return some(collection, (item) => this._depthFirstSearch(item, input));
  }

  // returns capitalized string
  toTitleCase(str) {
    str = str.replace(/_/g, ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  @action onFocus = () => {
    this.iconName = "arrow-back";
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.searchbarTop, {
          toValue: 20,
          duration: 125,
        }),
        Animated.timing(this.searchbarWidth, {
          toValue: Dimensions.get('window').width,
          duration: 125
        }),
        Animated.timing(this.searchbarHeight, {
          toValue: 50,
          duration: 125
        }),
      ]),
      Animated.timing(this.resultsViewH, {
        toValue: Dimensions.get('window').height,
        duration: 125
      }),
    ]).start();
  }

  // processes search results
  // creates list view to hold search result rows
  @action handleResults = (results) => {
    if (results) {
      this.searchResultsDataSource = this.searchResultsDs.cloneWithRows(results)
      // TODO: this will definitely need changing on Android
      this.resultsListView = (
        <ListView style = {styles.searchResultsContainer}
          dataSource = {this.searchResultsDataSource}
          renderRow = {(rowData) => this.renderSearchResultRow(rowData)}
          enableEmptySections
        />
      );
    }
  }

  // clear search results view
  @action clearSearchResultsView = () => {
    this.searchResultsView = null;
  }

  renderSearchView = () => {
    if (this.iconName == 'arrow-back') {
      return (
        <Animated.View
          style = {[styles.resultsViewContainer, {
            height: this.resultsViewH,
            top: this.searchbarHeight
          }]}
        >
          <View style = {[styles.resultViewButtonContainer]}>
            <TouchableOpacity ref = {(ref) => this.nearby = ref} onPress = {() => {this.searchButtonSelected = 'nearby'}} style = {styles.resultViewButton}>
              <View style = {{width: 60, alignItems: 'center'}}>
                <Icon name = "location-on" size = {25} color = {this.searchButtonSelected == 'nearby' ? GREEN : 'lightgrey'} style = {{alignSelf: 'center'}}/>
                <Text style = {{color: this.searchButtonSelected == 'nearby' ? GREEN : 'lightgrey'}}>Nearby</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity ref = {(ref) => this.favorite = ref} onPress = {() => {this.searchButtonSelected = 'favorite'}} style = {styles.resultViewButton}>
              <View style = {{width: 60, alignItems: 'center'}}>
                <Icon name = "favorite" size = {25} color = {this.searchButtonSelected == 'favorite' ? GREEN : 'lightgrey'} style = {{alignSelf: 'center'}}/>
                <Text style = {{color: this.searchButtonSelected == 'favorite' ? GREEN : 'lightgrey'}}>Favorites</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity ref = {(ref) => this.recent = ref} onPress = {() => {this.searchButtonSelected = 'recent'}} style = {styles.resultViewButton}>
              <View style = {{width: 60, alignItems: 'center'}}>
                <Icon name = "access-time" size = {25} color = {this.searchButtonSelected == 'recent' ? GREEN : 'lightgrey'} style = {{alignSelf: 'center'}}/>
                <Text style = {{color: this.searchButtonSelected == 'recent' ? GREEN : 'lightgrey'}}>Recent</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style = {[styles.resultListContainer]}>
            {this.resultsListView}
          </View>
        </Animated.View>
      )
    }
  }

  // renders clickable search result row
  renderSearchResultRow = (rowData) => {
    return (
      <TouchableOpacity style = {styles.searchResultRow} onPress = {() => {this.props.handleResultSelect(rowData)}}>
        <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image style = {{height: 50, width: 50, borderRadius: 25, marginRight: 10}} source = {food_truck_img}/>
          <View style = {{flex: 1, justifyContent: 'center', height: 40}}>
            <Text style = {styles.searchResultText}>{this.toTitleCase(rowData.truck_name)}</Text>
            <View style = {{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <CommunityIcon style = {{height: 10}} name = "walk" size = {10} color = {GREEN}/>
              <Text style = {styles.subtitleText}>4 min</Text>
            </View>
            <View style = {{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <CommunityIcon style = {{height: 10}} name = "silverware" size = {10} color = {GREEN}/>
              <Text style = {styles.subtitleText}>{this.toTitleCase(rowData.cuisine)}</Text>
            </View>
          </View>
          <Icon name = {'chevron-right'} size = {20} color = {GREEN}/>
        </View>
      </TouchableOpacity>
    );
  }

  render = () => {
    const {
      placeholder,
      heightAdjust,
      backgroundColor,
      iconColor,
      textColor,
      selectionColor,
      placeholderTextColor,
      onBack,
      hideBack,
      hideX,
      iOSPadding,
      iOSHideShadow,
      onSubmitEditing,
      onFocus,
      focusOnLayout,
      autoCorrect,
      autoCapitalize,
      keyboardAppearance,
      fontFamily,
      backButton,
      backButtonAccessibilityLabel,
      closeButton,
      closeButtonAccessibilityLabel,
      backCloseSize,
        fontSize
    } = this.props;
    return (
        <Animated.View style={[styles.navWrapper, {top: this.searchbarTop, width: this.searchbarWidth, height: this.searchbarHeight}, {...this.props.style}]}>
          <TouchableOpacity
            style = {{left: 5, position: 'absolute', alignItems: 'center'}}
            disabled = {this.iconName === 'arrow-back' ? false : true}
            onPress = {() => {this._handleBack()}}
          >
            <Icon name = {this.iconName} size = {20} color = {GREEN} />
          </TouchableOpacity>
          <TextInput
            ref={(ref) => this.textInput = ref}
            style = {styles.textInput}
            onLayout={() => focusOnLayout && this.textInput.focus()}
            selectionColor={selectionColor}
            onChangeText={(input) => this._onChangeText(input)}
            onSubmitEditing={() => onSubmitEditing ? onSubmitEditing() : null}
            onFocus={() => this.onFocus()}
            onBlur={this._handleBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={this.input}
            underlineColorAndroid='transparent'
            returnKeyType='search'
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            keyboardAppearance={keyboardAppearance}
          />
          { this.input != '' &&
            <TouchableOpacity
              accessible={true}
              accessibilityComponentType='button'
              accessibilityLabel={closeButtonAccessibilityLabel}
              onPress={this._handleX}>
              <Icon
                name={'close'}
                size={15}
                color={GREEN}
              />
            </TouchableOpacity>
          }
          {this.renderSearchView()}
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  navWrapper: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    shadowOffset: {width: 3, height: 3},
    shadowRadius: 4,
    shadowOpacity: 0.3,
  },
  textInput: {
    flex: 1,
    left: 25
  },
  resultsViewContainer: {
    flex: 1,
    position: 'absolute',
    overflow: 'hidden',
  },
  resultViewButtonContainer: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    overflow: 'hidden',
    justifyContent: 'space-around',
  },
  resultViewButton: {
    justifyContent: 'center'
  },
  resultListContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  searchResultText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Arial Rounded MT Bold',
  },
  searchResultRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
    marginLeft: 25,
    marginRight: 25,
  },
  subtitleText: {
    fontSize: 10,
    fontFamily: 'Arial Rounded MT Bold',
    color: '#111111',
    position: 'absolute',
    left: 20
  },
});

/*

*/
