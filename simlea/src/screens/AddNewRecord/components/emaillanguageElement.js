import React, {useState, useEffect} from 'react';
import {Image, Pressable, View, Text, StyleSheet, Platform} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

export default function EmaillanguageElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const dispatch = useDispatch();

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  console.log(props.elements[0]);
  /* language options which is selected by user */ const [
    selectedData,
    setSelectedData,
  ] = useState();
  const [selectedDataTextHolder, setSelectedDataTextHolder] = useState();
  const [errorMessage, setErrorMessage] = useState();

  console.log(props.elements[0]);
  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedData == '' || selectedData == null) {
        setErrorMessage('This field is required');
      }
    }
  }, [formReducer.showFormElementsError, selectedData]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        if (
          formReducer.valuesHolderOfElements[0][props.elements[0].name] == ''
        ) {
          setSelectedDataTextHolder('');
        }
        setSelectedData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        if (
          typeof formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] == 'undefined'
          //||
          // formReducer.valuesHolderOfElements[0][props.elements[0].name][
          // props.collectionData[0].activeIndex
          // ] == ''
        ) {
          setSelectedDataTextHolder('');
        }
        setSelectedData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSelectedData(null);
    }
  }, [
    typeof props.collectionData == 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  useEffect(() => {
    if (
      typeof selectedData != 'undefined' &&
      selectedData != '' &&
      selectedData != null
    ) {
      Object.keys(props.elements[0].langOpts).map(
        (singleLanguageKey, indexx) => {
          selectionList = props.elements[0].langOpts[singleLanguageKey].map(
            (singleLanguageDescription, index) => {
              if (singleLanguageDescription.value == selectedData) {
                setSelectedDataTextHolder(singleLanguageDescription.text);
              }
            },
          );
        },
      );
    }
  }, [selectedData]);

  /* show or hide selection list dropdown */ const [
    showSelectionDropdown,
    setShowSelectionDropdown,
  ] = useState(false);

  /* holds languages key which is coming from backend */ let selectionList =
    null;
  const languageKeys = Object.keys(props.elements[0].langOpts);
  console.log(languageKeys);
  selectionList = languageKeys.map((singleLanguageKey, indexx) => {
    return props.elements[0].langOpts[singleLanguageKey].map(
      (singleLanguageDescription, index) => {
        if (singleLanguageDescription.value != '') {
          return (
            <Pressable
              key={index}
              style={styles.singleCheckBoxButton}
              onPress={() => {
                setShowSelectionDropdown(false);
                setSelectedDataTextHolder(singleLanguageDescription.text);
                //setSelectedData(singleLanguageDescription.value);
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    singleLanguageDescription.value,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
              }}>
              <View
                style={
                  selectedData
                    ? styles.tickHolderContainerCheck
                    : styles.tickHolderContainer
                }>
                {singleLanguageDescription.text == selectedDataTextHolder ? (
                  <Image
                    style={styles.tickIcon}
                    source={require('../../../assets/images/tick-white.png')}
                  />
                ) : (
                  ''
                )}
              </View>
              <Text
                style={
                  themeState?.activeTheme === 'light'
                    ? styles.checkboxOptionTextStyleLight
                    : styles.checkboxOptionTextStyle
                }>
                {' '}
                {singleLanguageDescription.text}
              </Text>
            </Pressable>
          );
        }
      },
    );
  });
  return (
    <View style={styles.mainView}>
      {/* {selectedData == null ? (
        ''
      ) : (
        <View style={styles.emailLanguageLabelHolder}>
          <Text>{props.elements[0].label[formReducer.activeFormLanguage]}</Text>
        </View>
      )} */}

      <Pressable
        style={
          themeState?.activeTheme === 'light'
            ? styles.showModalButtonLight
            : styles.showModalButton
        }
        onPress={() => {
          return setShowSelectionDropdown(!showSelectionDropdown);
        }}>
        {typeof selectedData == 'undefined' ||
        selectedData == '' ||
        selectedData == null ? (
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.showModalButtonTextLight
                : styles.showModalButtonText
            }>
            {props.elements[0].label[formReducer.activeFormLanguage]}{' '}
          </Text>
        ) : (
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.showModalButtonTextLight
                : styles.showModalButtonText
            }>
            {' '}
            {selectedDataTextHolder}{' '}
          </Text>
        )}
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

      {showSelectionDropdown == true ? (
        <View style={styles.optionsHolder}>
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
          {selectionList}
        </View>
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
  mainView: {
    marginTop: 5,
  },
  // emailLanguageLabelHolder: {
  //   height: 25,
  //   marginLeft: 16,
  //   marginTop: 8,
  //   alignItem: 'flex-start',
  // },
  arrow: {height: 7, width: 10, resizeMode: 'contain'},
  showModalButton: {
    height: Platform.isPad === true ? 61 : 40,
    marginHorizontal: 15,
    borderRadius: Platform.isPad === true ? 6 : 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 10,
  },
  showModalButtonLight: {
    height: Platform.isPad === true ? 61 : 40,
    marginHorizontal: 15,
    borderRadius: Platform.isPad === true ? 6 : 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    marginTop: 15,
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
  optionsHolder: {
    marginLeft: '3%',
    alignItems: 'flex-start',
  },
  singleCheckBoxButton: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: Platform.isPad === true ? 12 : 10,
    marginLeft: Platform.isPad === true ? 12 : 10,
  },
  tickIcon: {
    height: Platform.isPad === true ? 14 : 10,
    width: Platform.isPad === true ? 14 : 10,
    resizeMode: 'contain',
  },
  tickHolderContainer: {
    height: Platform.isPad === true ? 24 : 20,
    width: Platform.isPad === true ? 24 : 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    backgroundColor: '#30C6EA',
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
  checkboxOptionTextStyle: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#EAEAEA',
  },
  checkboxOptionTextStyleLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#1a1a1a',
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
