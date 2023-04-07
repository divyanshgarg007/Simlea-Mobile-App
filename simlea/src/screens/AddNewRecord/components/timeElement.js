import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, Modal, Platform} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';

//import {Dimensions} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

export default function TimeElement(props) {
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const dispatch = useDispatch();

  /**show hide time modal */
  const [showTimeModal, setShowTimeModal] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  /**store time as set by user */
  const [time, setTime] = useState();

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (time == '' || time == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage('');
      }
    } else {
      if (time != '' && time != null) {
        setErrorMessage('');
      }
    }
  }, [formReducer.showFormElementsError, time]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        setTime(formReducer.valuesHolderOfElements[0][props.elements[0].name]);
      } else {
        setTime(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setTime(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  /**store current date as required by package */
  const [date, setDate] = useState(new Date());
  return showTimeModal == true ? (
    <DatePicker
      modal
      open={showTimeModal}
      date={date}
      mode="time"
      onConfirm={date => {
        setTime(date.toLocaleTimeString());
        setShowTimeModal(false);
        dispatch(
          formAction.updateDataOfInputAfterTypingByUser(
            date.toLocaleTimeString(),
            props.elements[0].name,
            props.collectionData,
          ),
        );
      }}
      onCancel={() => {
        setShowTimeModal(false);
      }}
    />
  ) : (
    <View style={styles.mainHolder}>
      <Pressable
        style={
          themeState?.activeTheme === 'light'
            ? styles.showModalButtonLight
            : styles.showModalButtonDark
        }
        onPress={() => {
          return setShowTimeModal(true);
        }}>
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.showModalButtonTextLight
              : styles.showModalButtonTextDark
          }>
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
          {time ? time : 'Select Time'}
        </Text>
      </Pressable>
      <View style={styles.errorTextHolder}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainHolder: {
    width: '93%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    marginTop: 15,
  },
  showModalButtonDark: {
    borderColor: '#EAEAEA',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  showModalButtonLight: {
    borderColor: '#8F92A133',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  showModalButtonTextDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#FBFBFB',
  },
  showModalButtonTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#1a1a1a',
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
