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
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

import * as formServices from '../../../services/formServices';
import {CustomButton} from '../../../components';

export default function SendleadtoElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [
    filteredDataListAfterUserTypesInSearch,
    setFilteredDataListAfterUserTypesInSearch,
  ] = useState([]); //this is used to store json data when user typed in search box.
  const [nestedListJsonData, setNestedListJsonData] = useState(null); //this is used to store json data when mapping is done from the recieved data from backend api.
  const [showSuperSelectModal, setShowSuperSelectModal] = useState(false); //this is used to display all modal content unless its only show button only.
  const [selectedKeyForFilter, manageSelectedKeyForAddOrRemove] =
    useState('all'); //this is used to store column name to which filtering needs to be done based on search input.
  const [selectedListItem, manageSelectedListForAddOrRemove] = useState([]);

  const [showManualAddEmailForm, setShowManualAddEmailForm] = useState(false);
  const [manualAddEmailFormDataHolder, setManualAddEmailFormDataHolder] =
    useState(null);
  const [manualAddedEmailData, setManualAddedEmailData] = useState([]);
  const [emailListHolder, manageEmailListHolder] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  console.log(emailListHolder);
  console.log(selectedListItem);

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (emailListHolder.length == 0 || emailListHolder == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError, emailListHolder]);

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  useEffect(() => {
    Array.isArray(formReducer.valuesHolderOfElements) &&
    formReducer.valuesHolderOfElements.length > 0
      ? typeof props.collectionData == 'undefined'
        ? typeof formReducer.valuesHolderOfElements[0][
            props.elements[0].name
          ] != 'undefined' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name] != '' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name] != null
          ? manageEmailListHolder(
              formReducer.valuesHolderOfElements[0][
                props.elements[0].name
              ].split(','),
            )
          : []
        : typeof formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] != 'undefined' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] != null &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name] !=
            null &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name].length >
            0
        ? manageEmailListHolder(
            formReducer.valuesHolderOfElements[0][props.elements[0].name][
              props.collectionData[0].activeIndex
            ].split(','),
          )
        : manageEmailListHolder([])
      : manageEmailListHolder([]);
  }, []);

  //this is used to store selected list item.for multiple it store mutilple data for single select only single data.
  const [listOfKeys, manageListOfKeys] = useState([]); //this is used to store list of all column names based on which  list is displayed{only key names of that is included in list} and also searching is done
  const [showFilterDropdownList, manageFilterDropdownList] = useState(false); //this is used to show serach columns dropdown based on which user selects or unselect column name for searching
  const [searchTextInput, updateSearchTextInput] = useState(''); // it stores search text input data based on which searching is done.

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
    if (nestedListJsonData == null) {
      /** below lines are used to fetch nested list data from backend  based on the element id*/
      const responseData = formServices
        .getNestedListValuesServiceMethod(props.elements[0].id)
        .then(response => {
          let valuesArray = [
            response.data.data,
          ]; /**this is used to store array of json which is coming from backend and later it acts as value of key-value pair{after mapping} */

          let obj = {}; /**it used to stores json for each iteration */
          let jsonArrayOfNestedValues =
            []; /**it stores jsons values as array of each iteration */
          let tempKeyArray = [];
          tempKeyArray = Object.keys(
            valuesArray[0],
          ); /**it stores keys of data .it is done so that iteration can be done on data objects */

          tempKeyArray.forEach((keyOfArray, mainIndex) => {
            let arr =
              valuesArray[0][
                keyOfArray
              ]; /**temporary array to store values of {data json} data */

            response.data.headers.forEach((currentElement, index) => {
              obj[currentElement] = arr[index];
            });
            jsonArrayOfNestedValues.push(obj);
            obj = {};
            return true;
          });
          setNestedListJsonData(jsonArrayOfNestedValues);
          let selectedListHolderArray = [];
          emailListHolder.forEach((singleEmailItem, index) => {
            if (singleEmailItem.length > 0) {
              jsonArrayOfNestedValues.forEach(singleListItem => {
                if (
                  singleListItem[props.elements[0].emailColumn] ==
                  singleEmailItem
                ) {
                  let nnn = [...selectedListHolderArray];
                  if (nnn.indexOf(singleListItem) == -1) {
                    console.log('inside loop');
                    console.log(nnn);
                    nnn.push(singleListItem);
                    console.log(nnn);
                    console.log('loop closed');
                    selectedListHolderArray = nnn;
                  }
                }
              });
            }
            if (index == emailListHolder.length - 1) {
              manageSelectedListForAddOrRemove(selectedListHolderArray);
            }
          });
        })
        .catch(err => {});
    }
  }, [emailListHolder]);

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
    selectedListItem.length; /**stores the length of selected element in array .for display in ui purpose*/
  /**
   *
   * @param {} item => its a single json item which is made by mapping the data from backend .
   * @returns
   */
  let renderManualAddedDataForSelectionList = ({item, index}) => {
    return (
      <View key={index} style={styles.listItems}>
        <TouchableOpacity
          onPress={() => {
            let ll = [...emailListHolder];
            let mm = [...manualAddedEmailData];
            const index1 = ll.indexOf(item);
            const index2 = mm.indexOf(item);
            ll.splice(index1, 1);
            mm.splice(index2, 1);
            let selectedString = ll.join(',');
            manageEmailListHolder(ll);
            setManualAddedEmailData(ll);
            dispatch(
              formAction.updateDataOfInputAfterTypingByUser(
                selectedString,
                props.elements[0].name,
                props.collectionData,
              ),
            );
          }}>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.listItemsTextLight
                : styles.listItemsText
            }>
            {item}
          </Text>
        </TouchableOpacity>

        <Image
          style={styles.selectedIcon}
          source={require('../../../assets/images/tick.png')}
        />
      </View>
    );
  };

  let renderDataForSelectionList = ({item, index}) => {
    /**this is used for checking if all the view columns coming with element data does contain values or not
    .if all the column key does not have value then it should not be rendered on frontend list view  */
    let flagToRenderListOrNot = false;
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
          return <Text key={index}>{item[singleKeyItem]},</Text>;
        } else {
          return <Text key={index}>{item[singleKeyItem]}</Text>;
        }
      }
    });

    if (flagToRenderListOrNot == true) {
      return (
        <View key={index} style={styles.listItems}>
          <TouchableOpacity
            onPress={() => {
              if (selectedListItem.indexOf(item) > -1) {
                let nn = [...selectedListItem];
                const index = nn.indexOf(item);
                nn.splice(index, 1);

                let tempEmailArray = [...emailListHolder];
                const emailIndex = tempEmailArray.indexOf(
                  item[props.elements[0].emailColumn],
                );
                tempEmailArray.splice(emailIndex, 1);
                let selectedString = tempEmailArray.join(',');
                manageEmailListHolder(tempEmailArray);
                manageSelectedListForAddOrRemove(nn);
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    selectedString,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
              } else {
                let nn = [...selectedListItem];
                nn.push(item);
                let tempEmailArray = [...emailListHolder];
                tempEmailArray.push(item[props.elements[0].emailColumn]);
                let selectedString = tempEmailArray.join(',');
                manageEmailListHolder(tempEmailArray);
                manageSelectedListForAddOrRemove(nn);
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    selectedString,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
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
          {selectedListItem.indexOf(item) > -1 ? (
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
    <SafeAreaView style={styles.mainContainer}>
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

          <TouchableOpacity
            onPress={() => {
              setShowManualAddEmailForm(!showManualAddEmailForm);
            }}>
            {showManualAddEmailForm === true ? (
              <Image
                source={require('../../../assets/images/closes.png')}
                style={{
                  height: 25,
                  width: 25,
                  marginTop: 15,
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={require('../../../assets/images/add.png')}
                style={{
                  height: 25,
                  width: 25,
                  marginTop: 15,
                  alignSelf: 'center',
                }}
              />
            )}
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

        {showManualAddEmailForm == true ? (
          <View
            style={
              themeState?.activeTheme === 'light'
                ? styles.bottomRowLight
                : styles.bottomRow
            }>
            <View style={styles.searchIconHolder}>
              <TextInput
                value={manualAddEmailFormDataHolder}
                style={
                  themeState?.activeTheme === 'light'
                    ? styles.searchInputLight
                    : styles.searchInput
                }
                onChangeText={inputText =>
                  setManualAddEmailFormDataHolder(inputText)
                }
                placeholder="Add Email"
                placeholderTextColor={
                  themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
                }
              />
            </View>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                if (manualAddEmailFormDataHolder.length > 0) {
                  let userTypedCurrentEmail = manualAddEmailFormDataHolder;
                  let flagForExistingEmail = false;
                  let ll = [];
                  if (emailListHolder.length == 0 || emailListHolder == null) {
                    ll.push(userTypedCurrentEmail);
                    manageEmailListHolder(ll);
                    setManualAddedEmailData(ll);
                    let selectedString = ll.join(',');

                    dispatch(
                      formAction.updateDataOfInputAfterTypingByUser(
                        selectedString,
                        props.elements[0].name,
                        props.collectionData,
                      ),
                    );
                    setManualAddEmailFormDataHolder('');
                  } else {
                    ll = [...emailListHolder];
                    for (i = 0; i <= ll.length - 1; i++) {
                      let currentEmail = ll[i];
                      if (currentEmail.includes(':cc')) {
                        userTypedCurrentEmail =
                          userTypedCurrentEmail.concat(':cc');
                      }
                      if (currentEmail.includes(':bcc')) {
                        userTypedCurrentEmail =
                          userTypedCurrentEmail.concat(':bcc');
                      }
                      if (ll.includes(userTypedCurrentEmail)) {
                        flagForExistingEmail = true;
                        break;
                      }
                      if (i == ll.length - 1) {
                        if (flagForExistingEmail == false) {
                          let mm = [...manualAddedEmailData];
                          mm.push(userTypedCurrentEmail);
                          ll.push(userTypedCurrentEmail);
                          setManualAddedEmailData(mm);

                          manageEmailListHolder(ll);
                          let selectedString = ll.join(',');

                          dispatch(
                            formAction.updateDataOfInputAfterTypingByUser(
                              selectedString,
                              props.elements[0].name,
                              props.collectionData,
                            ),
                          );
                          setManualAddEmailFormDataHolder('');
                        }
                      }
                    }
                  }
                }
              }}>
              <Text style={[styles.actionTitle, {marginTop: 10}]}>
                Add Email
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
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
                  onPress={() => [
                    manageFilterDropdownList(!showFilterDropdownList),
                  ]}>
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
              {showFilterDropdownList == true ? (
                <View style={styles.filterDropdownContainer}>
                  <FlatList
                    data={listOfKeys}
                    renderItem={renderDataForFilter}
                  />
                </View>
              ) : (
                ''
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
                data={searchTextInput.length > 0 ? [] : manualAddedEmailData}
                renderItem={renderManualAddedDataForSelectionList}
              />

              <FlatList
                data={
                  searchTextInput.length > 0
                    ? filteredDataListAfterUserTypesInSearch
                    : nestedListJsonData
                }
                renderItem={renderDataForSelectionList}
              />
            </View>
          </View>
        )}
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
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
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
  arrow: {height: 7, width: 10, resizeMode: 'contain'},
  showModalButton: {
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 10,
  },
  showModalButtonLight: {
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 10,
  },
  showModalButtonText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#fff',
  },
  showModalButtonTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1a1a1a',
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
    paddingLeft: Platform.isPad === true ? 42 : 35,
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
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    paddingLeft: Platform.isPad === true ? 42 : 35,
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
    textAlign: 'center',
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

  //from here filter dropdown conater and list style is there
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
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    color: '#1a1a1a',
  },
  selectedIconForFilter: {
    height: Platform.isPad === true ? 18 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
    marginRight: 15,
  },
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
