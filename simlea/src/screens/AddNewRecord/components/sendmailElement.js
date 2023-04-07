import React, {useState, useEffect} from 'react';
import {Image, View, Pressable, Text, StyleSheet, Platform} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

export default function sendmailElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const dispatch = useDispatch();

  const [selectedCheckBoxData, setSelectedCheckBoxData] = useState();

  const [errorMessage, setErrorMessage] = useState();
  const [keyIsPressed, setKeyIsPressed] = useState(false);

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedCheckBoxData == '' || selectedCheckBoxData == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError, selectedCheckBoxData]);
  useEffect(() => {
    if (
      selectedCheckBoxData == '' &&
      props.elements[0].required &&
      keyIsPressed
    ) {
      setErrorMessage('This field is required');
    } else {
      setErrorMessage();
    }
  }, [selectedCheckBoxData, keyIsPressed]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        setSelectedCheckBoxData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setSelectedCheckBoxData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSelectedCheckBoxData(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  return (
    <View style={styles.mainView}>
      <Pressable
        style={styles.singleCheckBoxButton}
        onPress={() => {
          setSelectedCheckBoxData(!selectedCheckBoxData);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              !selectedCheckBoxData,
              props.elements[0].name,
              props.collectionData,
            ),
          );
          setKeyIsPressed(true);
        }}>
        <View
          style={
            selectedCheckBoxData
              ? styles.tickHolderContainerCheck
              : styles.tickHolderContainer
          }>
          {selectedCheckBoxData == true || selectedCheckBoxData == 'true' ? (
            <Image
              style={styles.tickIcon}
              source={require('../../../assets/images/tick-white.png')}
            />
          ) : (
            ''
          )}
        </View>
        {props.elements[0].required === true ? (
          <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
        ) : (
          ''
        )}
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.checkboxOptionTextStyleLight
              : styles.checkboxOptionTextStyle
          }>
          {props.elements[0].label[formReducer.activeFormLanguage]}
        </Text>
      </Pressable>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    // marginBottom: 10,
  },

  singleCheckBoxButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 15,
  },
  tickHolderContainer: {
    height: Platform.isPad === true ? 24 : 20,
    width: Platform.isPad === true ? 24 : 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickHolderContainerCheck: {
    height: Platform.isPad === true ? 24 : 20,
    width: Platform.isPad === true ? 24 : 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    backgroundColor: '#30C6EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickIcon: {
    height: Platform.isPad === true ? 12 : 10,
    width: Platform.isPad === true ? 12 : 10,
    resizeMode: 'contain',
  },
  checkboxOptionTextStyle: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#EAEAEA',
  },
  checkboxOptionTextStyleLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: 15,
  },
});
