import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import GlobalStyle from '../../../style/globalstyle';
import {Dimensions} from 'react-native';
import * as formServices from '../../../services/formServices';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';
import * as formActionService from '../../../database/FormActionDataService';

export default function UserElement(props) {
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const dispatch = useDispatch();
  const eventReducer = useSelector(state => state.rootReducers?.eventState);

  /* boolean to show hide dropdown list of user */
  /** store userlist data*/
  const [userList, setUserList] = useState([]);
  const [showDropdown, setDropdownView] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  // const [displayNames, setDisplayNames] = useState('');

  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedEmailId == '' || selectedEmailId == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError, selectedEmailId]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData == 'undefined') {
        // if (formReducer.valuesHolderOfElements[0][props.elements[0].name] == '') {
        //   setDisplayNames('');
        // }
        setSelectedEmailId(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        // if (typeof formReducer.valuesHolderOfElements[0][props.elements[0].name][props.collectionData[0].activeIndex] == 'undefined' ||
        //   formReducer.valuesHolderOfElements[0][props.elements[0].name][props.collectionData[0].activeIndex
        //   ] == '') {
        //   setDisplayNames('');
        // }
        setSelectedEmailId(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSelectedEmailId(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);
  let listOfUser = null;

  useEffect(() => {
    /** below lines are used to fetch employee list data from backend  based on the element id*/
    /** / /; // eventReducer.eventList.data[0].eventId, OLD */
    // const responseData = formServices
    //   .getEmployesListForUserElementMethod(
    //     eventReducer.eventListFromSQL?.data[0].remote_id,
    //   )
    //   .then(response => {
    //     setUserList([...response.data.list]);
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //     console.log(err.response.data);
    //     console.log("error occured in user element api call");
    //   });
    fetchEmpRecordFromLocalDB();
  }, []);

  async function fetchEmpRecordFromLocalDB() {
    let resOfUserRecord = await formActionService.getEmployeeList();
    setUserList(resOfUserRecord);
    // alert('resOfUserRecord'+JSON.stringify(resOfUserRecord))
  }

  if (userList.length > 0) {
    listOfUser = userList.map((item, index) => {
      return (
        <Pressable
          style={styles.singleDropdownItem}
          key={index}
          onPress={() => {
            let tempVar = item.firstName + ' ' + item.lastName;

            setSelectedEmailId(tempVar);
            //setDisplayNames(item);
            setDropdownView(false);
            dispatch(
              formAction.updateDataOfInputAfterTypingByUser(
                tempVar,
                props.elements[0].name,
                props.collectionData,
              ),
            );
          }}>
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
          <Text style={styles.dropdownItemText}>
            {item.lastName},{item.firstName}
          </Text>
          {item.firstName + ' ' + item.lastName == selectedEmailId ? (
            <Image
              style={styles.checkIcon}
              source={require('../../../assets/images/tick.png')}
            />
          ) : (
            ''
          )}
        </Pressable>
      );
    });
  } else {
    listOfUser = null;
  }
  return (
    <View style={styles.mainHolder}>
      <View style={styles.dropdownButtonHolder}>
        <Pressable
          style={
            themeState?.activeTheme === 'light'
              ? styles.dropdownButtonLight
              : styles.dropdownButtonDark
          }
          onPress={() => {
            setDropdownView(!showDropdown);
          }}>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.dropdownButtonTextLight
                : styles.dropdownButtonTextDark
            }>
            {selectedEmailId != ''
              ? selectedEmailId == null
                ? 'null'
                : selectedEmailId.lastName
              : ''}
            {selectedEmailId != '' ? ',' : ''}
            {selectedEmailId != ''
              ? selectedEmailId == null
                ? 'null'
                : selectedEmailId
              : ''}
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
      </View>
      {showDropdown == true ? (
        <View style={styles.contentContainer}>{listOfUser}</View>
      ) : (
        ''
      )}

      <View style={styles.errorTextHolder}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    </View>
  );
}
export const styles = StyleSheet.create({
  mainHolder: {
    width: '100%',
  },
  dropdownButtonHolder: {
    width: '92%',
    height: Platform.isPad === true ? 27 : 26,
    marginTop: Platform.isPad === true ? 15 : 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dropdownButtonDark: {
    backgroundColor: 'rgba(208, 211, 212,0.3 )',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: Platform.isPad === true ? 30 : 26,
  },
  dropdownButtonLight: {
    backgroundColor: 'rgba(129, 129, 165, 0.2)',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: Platform.isPad === true ? 30 : 26,
  },
  dropdownButtonTextLight: {
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
  },
  dropdownButtonTextDark: {
    color: '#FBFBFB',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
  },
  contentContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
  },
  singleDropdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    display: 'flex',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
  },
  arrow: {
    height: 7,
    width: 10,
    resizeMode: 'contain',
    marginLeft: Platform.isPad === true ? 10 : 0,
  },

  checkIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    marginLeft: Platform.isPad === true ? 20 : 0,
  },
  errorTextHolder: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
