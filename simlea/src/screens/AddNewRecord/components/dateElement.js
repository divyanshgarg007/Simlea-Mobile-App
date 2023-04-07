/* eslint-disable prettier/prettier */
import { autoCapitalize } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
//import normalize from 'react-native-normalize';
import { Dimensions } from 'react-native';
import moment from 'moment';
import { IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';

import * as formAction from '../../../redux/action/formAction';

export default function DateElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const dispatch = useDispatch();

  const [showDropdown, setDropdownView] = useState(false);

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [selectedDate, setSelectedDate] = useState();
  const [date, setDate] = useState(new Date());

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedDate == '' || selectedDate == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    } else {
      if (selectedDate != '' && selectedDate != null) {
        setErrorMessage('');
      }
    }
  }, [formReducer.showFormElementsError, selectedDate]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        setSelectedDate(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {

        setSelectedDate(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
          props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSelectedDate(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  let dateLists = null;

  if (props.elements[0].startDate != '') {
    /** start date is coming from backend */
    let startDate = moment(props.elements[0].startDate);
    /** end date is coming from backend */
    let endDate = moment(props.elements[0].endDate);

    let noOfDaysInBetween = endDate.diff(startDate, 'days');
    /** formated date holer in between start and end days */
    let formatedDateHolder = [];
    let nonFormatedDateHolder = [];

    for (let i = 0; i <= noOfDaysInBetween; i++) {
      let dt = null;
      let tt = null;
      dt = moment(startDate).add(i, 'days').format('dddd,DD-MM-YYYY');
      tt = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
      formatedDateHolder.push(dt);
      nonFormatedDateHolder.push(tt);
    }
    console.log(nonFormatedDateHolder);
    console.log(formatedDateHolder);
    dateLists = formatedDateHolder.map((item, index) => {
      return (
        <Pressable
          style={styles.singleDropdownItem}
          key={index}
          onPress={() => {
            setSelectedDate(nonFormatedDateHolder[index]);
            setDropdownView(false);
            dispatch(
              formAction.updateDataOfInputAfterTypingByUser(
                nonFormatedDateHolder[index],
                props.elements[0].name,
                props.collectionData,
              ),
            );
          }}>
          <Text style={styles.dropdownItemText}>{item}</Text>
        </Pressable>
      );
    });
  } else {
    dateLists = (
      <DatePicker
        modal
        open={showDropdown}
        date={date}
        mode="date"
        onConfirm={date => {
          setSelectedDate(date.toLocaleDateString());
          setDropdownView(false);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              date.toLocaleDateString(),
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }}
        onCancel={() => {
          setDropdownView(false);
        }}
      />
    );
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
            {selectedDate != '' && selectedDate != null ? moment(selectedDate).format('dddd,DD-MM-YYYY') : ''}
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
      {props.elements[0].required === true ? (
        <Text style={{ color: 'red', flexWrap: 'wrap' }}>*</Text>
      ) : (
        ''
      )}
      {showDropdown == true ? (
        <View style={styles.contentContainer}>{dateLists}</View>
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
    // width: Dimensions.get('window').width / 2 - 26,
    width: '92%',
    height: Platform.isPad === true ? 27 : 26,
    marginTop: Platform.isPad === true ? 15 : 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dropdownButtonDark: {
    backgroundColor: 'rgba(208, 211, 212,0.3 )',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: Platform.isPad === true ? 6 : 4,
    paddingHorizontal: Platform.isPad === true ? 18 : 10,
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: Platform.isPad === true ? 30 : 26,
  },
  dropdownButtonLight: {
    backgroundColor: 'rgba(129, 129, 165, 0.2)',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: Platform.isPad === true ? 6 : 4,
    paddingHorizontal: Platform.isPad === true ? 18 : 10,
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
