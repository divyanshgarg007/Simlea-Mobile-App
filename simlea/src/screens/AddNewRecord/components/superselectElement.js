/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Modal,
  FlatList,
  Pressable,
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
//import { TextInput } from 'react-native-paper';
import GlobalStyle from '../../../style/globalstyle';
import {Dimensions} from 'react-native';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';
import * as formServices from '../../../services/formServices';
import {IconButton} from 'react-native-paper';
import {CustomButton} from '../../../components';
import * as formActionService from '../../../database/FormActionDataService';

export default function SuperselectElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [
    filteredDataListAfterUserTypesInSearch,
    setFilteredDataListAfterUserTypesInSearch,
  ] = useState([]); //this is used to store json data when user typed in search box.
  const [nestedListJsonData, setNestedListJsonData] = useState([]); //this is used to store json data when mapping is done from the recieved data from backend api.
  const [showSuperSelectModal, setShowSuperSelectModal] = useState(false); //this is used to display all modal content unless its only show button only.
  const [selectedKeyForFilter, manageSelectedKeyForAddOrRemove] =
    useState('all'); //this is used to store column name to which filtering needs to be done based on search input.
  const [selectedListItem, manageSelectedListForAddOrRemove] = useState([]); //this is used to store selected list item.for multiple it store mutilple data for single select only single data.
  const [listOfKeys, manageListOfKeys] = useState([]); //this is used to store list of all column names based on which  list is displayed{only key names of that is included in list} and also searching is done
  const [showFilterDropdownList, manageFilterDropdownList] = useState(false); //this is used to show serach columns dropdown based on which user selects or unselect column name for searching
  const [searchTextInput, updateSearchTextInput] = useState(''); // it stores search text input data based on which searching is done.

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  const [errorMessage, setErrorMessage] = useState();
  const [keyIsPressed, setKeyIsPressed] = useState(false);

  getMappedData = data => {
    console.log('getMappedData is executed');
    let map = props.elements[0].map;
    console.log(map);
    //console.log(data);
    if (map) {
      let mappedData = {};
      let isValid = false;
      Object.keys(map).forEach((item, index) => {
        if (data.hasOwnProperty(item) && map.hasOwnProperty(item)) {
          console.log(map[item]);
          isValid = true;
          mappedData[props.elements[0].map[item]] = data[item];
        }
        if (isValid == true && index == Object.keys(map).length - 1) {
          data = mappedData;
        }
      });
    }
    console.log('Mapped data', data);
    dispatch(
      formAction.updateValuesOfOCRAndBadgeAndBarcodeElement(
        data,
        props.collectionData,
        formReducer.liveFormDataElements,
      ),
    );
    // return data;
  };

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedListItem.length == 0 || selectedListItem == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError, selectedListItem]);
  useEffect(() => {
    if (
      selectedListItem?.length == 0 &&
      props.elements[0].required == true &&
      keyIsPressed == true
    ) {
      setErrorMessage('This field is required');
    } else {
      setErrorMessage();
    }
  }, [selectedListItem, keyIsPressed]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        if (
          formReducer.valuesHolderOfElements[0][props.elements[0].name] == ''
        ) {
          manageSelectedListForAddOrRemove([]);
        } else {
          let ll =
            formReducer.valuesHolderOfElements[0][props.elements[0].name] !=
              null &&
            formReducer.valuesHolderOfElements[0][props.elements[0].name]
              .length > 0
              ? formReducer.valuesHolderOfElements[0][
                  props.elements[0].name
                ].replace(/\s*,\s*/g, ',')
              : '';
          if (ll != '') {
            manageSelectedListForAddOrRemove(ll.split('|'));
          } else {
            manageSelectedListForAddOrRemove([]);
          }
        }
      } else {
        if (
          typeof formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] == 'undefined'
        ) {
          manageSelectedListForAddOrRemove([]);
        } else {
          let ll =
            formReducer.valuesHolderOfElements[0][props.elements[0].name][
              props.collectionData[0].activeIndex
            ] != null &&
            formReducer.valuesHolderOfElements[0][props.elements[0].name][
              props.collectionData[0].activeIndex
            ].length > 0
              ? formReducer.valuesHolderOfElements[0][props.elements[0].name][
                  props.collectionData[0].activeIndex
                ].replace(/\s*,\s*/g, ',')
              : '';
          if (ll != '') {
            manageSelectedListForAddOrRemove(ll.split('|'));
          } else {
            manageSelectedListForAddOrRemove([]);
          }
          // manageSelectedListForAddOrRemove(formReducer.valuesHolderOfElements[0][props.elements[0].name][props.collectionData[0].activeIndex].split('|'));
        }
      }
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  useEffect(() => {
    if (searchTextInput.length > 0) {
      let filteredLists = [];
      nestedListJsonData.forEach((item, index) => {
        if (selectedKeyForFilter == 'all') {
          let checkForExistence = false;
          for (let i = 0; i < listOfKeys.length; i++) {
            checkForExistence = false;
            if (
              listOfKeys[i] != 'all' &&
              item[listOfKeys[i]]
                .toLowerCase()
                .indexOf(searchTextInput.toLowerCase()) > -1
            ) {
              checkForExistence = true;
              break;
            }
          }
          if (checkForExistence == true) {
            filteredLists.push(item);
          }
        } else {
          if (
            item[selectedKeyForFilter]
              .toLowerCase()
              .indexOf(searchTextInput.toLowerCase()) > -1
          ) {
            filteredLists.push(item);
          }
        }
      });
      setFilteredDataListAfterUserTypesInSearch(filteredLists);
    }
  }, [searchTextInput]);

  useEffect(() => {
    /** below lines are used to fetch nested list data from backend  based on the element id*/
    // const responseData = formServices
    //   .getNestedListValuesServiceMethod(props.elements[0].id)
    //   .then(response => {
    //     let valuesArray = [
    //       response.data.data,
    //     ]; /**this is used to store array of json which is coming from backend and later it acts as value of key-value pair{after mapping} */

    //     let obj = {}; /**it used to stores json for each iteration */
    //     let jsonArrayOfNestedValues =
    //       []; /**it stores jsons values as array of each iteration */
    //     let tempKeyArray = [];
    //     tempKeyArray = Object.keys(
    //       valuesArray[0],
    //     ); /**it stores keys of data .it is done so that iteration can be done on data objects */

    //     tempKeyArray.forEach((keyOfArray, mainIndex) => {
    //       let arr =
    //         valuesArray[0][
    //         keyOfArray
    //         ]; /**temporary array to store values of {data json} data */

    //       response.data.headers.forEach((currentElement, index) => {
    //         obj[currentElement] = arr[index];
    //       });
    //       jsonArrayOfNestedValues.push(obj);
    //       obj = {};
    //       return true;
    //     });
    //     setNestedListJsonData(jsonArrayOfNestedValues);

    //   })
    //   .catch((err) => {
    //     console.log(err.response.data);
    //     console.log("error occured in superselect element api call");
    //   });
    superSelect();
  }, []);

  async function superSelect() {
    let res = await formActionService.getSuperSelectRecord(props);
    setNestedListJsonData(res);
  }

  useEffect(() => {
    if (props.elements[0].hasOwnProperty('viewColumns')) {
      manageListOfKeys(['all', ...props.elements[0].viewColumns]);
    } else {
      let na = [];
      na.push('all');
      manageListOfKeys([...na]);
    }
  }, []);

  //}
  /**
   *
   * @param {} item => its a single item in list of keys array
   * @returns
   */
  const renderDataForFilter = ({item, index}) => {
    return (
      <View key={index} style={styles.listItemsForFilter}>
        <TouchableOpacity
          style={styles.listItemImageHolderForFilter}
          onPress={() => {
            manageSelectedKeyForAddOrRemove(item);
          }}>
          <Text style={styles.listItemsTextForFilter}>{item}</Text>
        </TouchableOpacity>
        {item == selectedKeyForFilter ? (
          <Image
            style={styles.selectedIconForFilter}
            source={require('../../../assets/images/tick.png')}
          />
        ) : null}
      </View>
    );
  };

  let xx =
    selectedListItem?.length; /**stores the length of selected element in array .for display in ui purpose*/
  /**
   *
   * @param {} item => its a single json item which is made by mapping the data from backend .
   * @returns
   */
  let renderDataForSelectionList = ({item, index}) => {
    /**this is used for checking if all the view columns coming with element data does contain values or not
    .if all the column key does not have value then it should not be rendered on frontend list view  */
    let flagToRenderListOrNot = false;
    let stringForStorage = '';
    /**it is done to render the list content that should be displayed on the screen based on which can select or unselect item
    .it should contain all the column names keys value that is coming with elements data in view columns  */
    let listOutputForDisplayContent = listOfKeys.map((singleKeyItem, index) => {
      if (
        singleKeyItem != 'all' &&
        item[singleKeyItem] != '' &&
        item[singleKeyItem].length > 0
      ) {
        flagToRenderListOrNot = true;
      }
      if (singleKeyItem != 'all') {
        if (index <= listOfKeys.length - 2) {
          stringForStorage += item[singleKeyItem];
          stringForStorage += ',';
          return <Text key={index}>{item[singleKeyItem]},</Text>;
        } else {
          stringForStorage += item[singleKeyItem];
          return <Text key={index}>{item[singleKeyItem]}</Text>;
        }
      }
    });
    if (flagToRenderListOrNot == true) {
      return (
        <View key={index} style={styles.listItems}>
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
          <TouchableOpacity
            style={styles.listItemImageHolder}
            onPress={() => {
              if (
                props.elements[0].multiple == false ||
                props.elements[0].multiple == null
              ) {
                getMappedData(item);
                let nn = [];
                nn.push(stringForStorage);
                manageSelectedListForAddOrRemove(nn);
                let selectedString = nn.join('|');
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    selectedString,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
                setKeyIsPressed(true);
              } else {
                if (selectedListItem.indexOf(stringForStorage) > -1) {
                  let nn = [...selectedListItem];
                  const index = nn.indexOf(stringForStorage);
                  const x = nn.splice(index, 1);
                  manageSelectedListForAddOrRemove(nn);
                  let selectedString = nn.join('|');
                  setKeyIsPressed(true);
                  dispatch(
                    formAction.updateDataOfInputAfterTypingByUser(
                      selectedString,
                      props.elements[0].name,
                      props.collectionData,
                    ),
                  );
                } else {
                  let nn = [...selectedListItem];
                  nn.push(stringForStorage);
                  manageSelectedListForAddOrRemove(nn);
                  let selectedString = nn.join('|');
                  dispatch(
                    formAction.updateDataOfInputAfterTypingByUser(
                      selectedString,
                      props.elements[0].name,
                      props.collectionData,
                    ),
                  );
                  setKeyIsPressed(true);
                }
              }
            }}>
            <Text
              style={
                themeState?.activeTheme === 'light'
                  ? styles.listItemsTextLight
                  : styles.listItemsText
              }>
              {listOutputForDisplayContent}
            </Text>
          </TouchableOpacity>
          {selectedListItem?.indexOf(stringForStorage) > -1 ? (
            <Image
              style={styles.selectedIcon}
              source={require('../../../assets/images/tick.png')}
            />
          ) : null}
        </View>
      );
    }
  };
  return showSuperSelectModal == true ? (
    <SafeAreaView style={styles.containerMain}>
      <Modal>
        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.topRowLight
              : styles.topRow
          }>
          <TouchableOpacity
            onPress={() => {
              setShowSuperSelectModal(false);
            }}>
            <Image
              style={styles.closeImage}
              source={require('../../../assets/images/back.png')}
            />
          </TouchableOpacity>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.topRowTextLight
                : styles.topRowText
            }>
            Multi Select ({xx}){' '}
          </Text>
        </View>

        <View style={styles.dropDown}>
          <View
            style={
              themeState?.activeTheme === 'light'
                ? styles.middleRowLight
                : styles.middleRow
            }>
            <Text
              style={
                themeState?.activeTheme === 'light'
                  ? styles.middleRowTextLight
                  : styles.middleRowText
              }>
              Search in{' '}
            </Text>
            <Pressable
              style={styles.filterButton}
              onPress={() => manageFilterDropdownList(!showFilterDropdownList)}>
              <Text
                style={
                  themeState?.activeTheme === 'light'
                    ? styles.middleRowTextLight
                    : styles.middleRowText
                }>
                all columns{' '}
              </Text>
              <Image
                style={styles.dropdownIcon}
                source={require('../../../assets/images/downIcon.png')}
              />
            </Pressable>
          </View>
          {showFilterDropdownList === true && (
            <View style={styles.filterDropdownContainer}>
              <FlatList data={listOfKeys} renderItem={renderDataForFilter} />
            </View>
          )}
        </View>

        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.bottomRowLight
              : styles.bottomRow
          }>
          <View style={styles.searchIconHolder}>
            <TextInput
              style={
                themeState?.activeTheme === 'light'
                  ? styles.searchInputLight
                  : styles.searchInput
              }
              onChangeText={inputText => updateSearchTextInput(inputText)}
              placeholder="Search"
              placeholderTextColor={
                themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
              }
            />
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/images/Search.png')}
            />
          </View>
          <CustomButton
            style={styles.confirmBtn}
            labelStyle={styles.actionTitle}
            title="Cancel"
            onPress={() => updateSearchTextInput('')}
          />
        </View>

        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.listHolderLight
              : styles.listHolder
          }>
          <FlatList
            data={
              searchTextInput.length > 0
                ? filteredDataListAfterUserTypesInSearch
                : nestedListJsonData
            }
            renderItem={renderDataForSelectionList}
          />
        </View>
      </Modal>
    </SafeAreaView>
  ) : (
    <View>
      <Pressable
        style={
          themeState?.activeTheme === 'light'
            ? styles.showModalButtonLight
            : styles.showModalButton
        }
        onPress={() => {
          return setShowSuperSelectModal(true);
        }}>
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.showModalButtonTextLight
              : styles.showModalButtonText
          }>
          {props.elements[0].label[formReducer.activeFormLanguage]}
        </Text>
        {themeState?.activeTheme === 'light' ? (
          <Image
            style={styles.arrow}
            source={require('../../../assets/images/dropIconDark.png')}
          />
        ) : (
          <Image
            style={styles.arrow}
            source={require('../../../assets/images/dropIcon.png')}
          />
        )}
      </Pressable>
      <View style={styles.errorTextHolder}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  showModalButton: {
    height: 40,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 10,
  },
  showModalButtonLight: {
    height: 40,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 10,
  },
  showModalButtonTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1a1a1a',
  },
  showModalButtonText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#fff',
  },
  containerMain: {
    flex: 1,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
  },
  topRowLight: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FBFBFB',
  },
  tickImage: {
    width: 24,
    height: 26,
    marginTop: 12,
    marginRight: 8,
  },
  closeImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  topRowText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 28 : 20,
    color: '#EAEAEA',
  },
  topRowTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 28 : 20,
    color: '#1A1A1A',
  },

  middleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#2E2E2E',
  },
  middleRowLight: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(129,129,165,.1)',
  },
  middleRowText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#FBFBFB',
  },
  middleRowTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1A1A1A',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    width: Platform.isPad === true ? 18 : 14,
    height: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
    paddingHorizontal: 15,
    backgroundColor: '#2E2E2E',
  },
  bottomRowLight: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  searchIconHolder: {
    width: Platform.isPad === true ? '80%' : '70%',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    height: Platform.isPad === true ? 57 : 44,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    fontSize: Platform.isPad === true ? 20 : 15,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    paddingLeft: Platform.isPad === true ? 45 : 35,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    color: '#fff',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  searchInputLight: {
    width: '100%',
    height: Platform.isPad === true ? 57 : 44,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    fontSize: Platform.isPad === true ? 20 : 15,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay500,
    paddingLeft: Platform.isPad === true ? 45 : 35,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#8F92A133',
    color: '#1A1A1A',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  searchIcon: {
    width: Platform.isPad === true ? 24 : 18,
    height: Platform.isPad === true ? 24 : 18,
    resizeMode: 'contain',
    position: 'absolute',
    left: Platform.isPad === true ? 9 : 7,
    top: Platform.isPad === true ? 16 : 12,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    width: Platform.isPad ? 150 : Platform.OS === 'android' ? '30%' : '100%',
    height: Platform.isPad === true ? 57 : 44,
  },
  actionTitle: {
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginTop: Platform.isPad === true ? 16 : 10,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
  },

  listHolder: {
    width: '100%',
    height: '90%',
    backgroundColor: '#2E2E2E',
    paddingTop: 10,
  },
  listHolderLight: {
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  listItemsText: {
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    color: '#FBFBFB',
  },
  listItemsTextLight: {
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    color: '#1a1a1a',
  },
  selectedIcon: {
    height: Platform.isPad === true ? 18 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
  },
  listItems: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    paddingVertical: 15,
    marginHorizontal: 15,
  },

  listItemsForFilter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#8F92A133',
  },

  // listHolder: {
  //   width: '100%',
  //   height: '90%',
  //   backgroundColor: '#2E2E2E',
  // },
  // listHolderLight: {
  //   width: '100%',
  //   height: '90%',
  //   backgroundColor: '#fff',
  // },
  // listHolderDesignOfLine: {
  //   height: 20,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#f3f3f3',
  //   width: '90%',
  //   marginLeft: 15,
  // },
  // listItems: {
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  // },
  // listItemImageHolder: {
  //   alignItems: 'center',
  //   height: 40,
  //   width: 40,
  // },
  // listItemsTextHolder: {
  //   width: Dimensions.get('window').width - 70,
  //   borderBottomWidth: 1,
  //   borderColor: '#f3f3f3',
  // },
  // listItemsText: {
  //   fontSize: 20,
  //   fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
  // },
  // selectedIcon: {
  //   height: 18,
  //   width: 21,
  // },

  //from here filter dropdown container and list style is there
  dropDown: {
    position: 'relative',
    zIndex: 11111,
  },
  filterDropdownContainer: {
    // height: 300,
    width: '92%',
    backgroundColor: '#FBFBFB',
    marginLeft: 'auto',
    marginRight: 'auto',
    elevation: 10,
    position: 'absolute',
    top: 50,
    zIndex: 11111,
    left: 15,
  },

  listItemImageHolderForFilter: {
    alignItems: 'center',
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  listItemsTextForFilter: {
    fontSize: Platform.isPad === true ? 20 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    color: '#1a1a1a',
  },
  selectedIconForFilter: {
    height: Platform.isPad === true ? 18 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
    marginRight: 15,
  },
  arrow: {height: 7, width: 10, resizeMode: 'contain'},
  errorTextHolder: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  errorText: {
    color: 'red',
    fontSize: Platform.isPad === true ? 18 : 14,
    letterSpacing: 0.5,
  },
});
