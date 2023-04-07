import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';
import GlobalStyle from '../../../style/globalstyle';

export default function TextElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const dispatch = useDispatch();

  const [showLabel, setShowLabel] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  //const [initialData, setInitialData] = useState();
  const [userInputData, setUserInputData] = useState();

  const [errorMessage, setErrorMessage] = useState();
  const [keyIsPressed, setKeyIsPressed] = useState(false);

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (userInputData == '' || userInputData == null) {
        setErrorMessage('This field is required');
      }
    }
  }, [formReducer.showFormElementsError, userInputData]);

  useEffect(() => {
    if (userInputData == '' && props.elements[0].required && keyIsPressed) {
      setErrorMessage('This field is required');
    } else {
      setErrorMessage();
    }
  }, [userInputData, keyIsPressed]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData == 'undefined') {
        setUserInputData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setUserInputData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setUserInputData(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  return (
    <View style={styles.mainView}>
      {/*<View style={styles.inputLabelHolder}>
        {props.elements[0].value.length > 0 || showLabel == true ? (
          <Text>{props.elements[0].label[formReducer.activeFormLanguage]}</Text>
        ) : (
          ''
        )}
      </View> */}
      {props.elements[0].required === true ? (
        <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
      ) : (
        ''
      )}
      <TextInput
        style={
          themeState?.activeTheme === 'light'
            ? styles.inputStyleLight
            : styles.inputStyle
        }
        value={typeof userInputData === 'undefined' ? '' : userInputData}
        placeholderTextColor={
          themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
        }
        onFocus={() => {
          setShowLabel(true);
        }}
        onBlur={() => {
          setShowLabel(false);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              userInputData,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }}
        onChangeText={inputData => {
          setUserInputData(inputData);
          setKeyIsPressed(true);
        }}
        placeholder={props.elements[0].label[formReducer.activeFormLanguage]}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    marginTop: 15,
  },
  inputStyle: {
    height: Platform.isPad === true ? 47 : 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: Platform.isPad === true ? 8 : 10,
    marginHorizontal: 15,
    color: '#fff',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
  },
  inputStyleLight: {
    height: Platform.isPad === true ? 47 : 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: Platform.isPad === true ? 8 : 10,
    marginHorizontal: 15,
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: 15,
  },
});
