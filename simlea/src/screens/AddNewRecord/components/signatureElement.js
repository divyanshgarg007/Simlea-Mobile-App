import React, {useState, useRef, useEffect} from 'react';
import {
  Pressable,
  ScrollView,
  View,
  StyleSheet,
  Button,
  Image,
  Text,
  Platform,
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import * as formAction from '../../../redux/action/formAction';

import {useDispatch, useSelector} from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';

export default function SignatureElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [errorMessage, setErrorMessage] = useState();

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  /** used to store converted image data when signature is done */
  const [signatureImageUri, setSignatureImageUri] = useState(null);

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (signatureImageUri == '' || signatureImageUri == null) {
        setErrorMessage('This field is required');
      }
    }
  }, [formReducer.showFormElementsError, signatureImageUri]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData == 'undefined') {
        setSignatureImageUri(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setSignatureImageUri(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSignatureImageUri(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  const ref = useRef();
  useEffect(() => {
    dispatch(formAction.makeScrollAbleWhenSignaturePadIsInActive());
  }, []);

  /** methods call when signature is done by user */
  const handleOK = signature => {
    if (typeof props.collectionData == 'undefined') {
      setSignatureImageUri(signature);
    } else {
      let tempArray = [];
      tempArray[props.collectionData[0].activeIndex] = signature;
      setSignatureImageUri(tempArray);
    }
    dispatch(
      formAction.updateDataOfInputAfterTypingByUser(
        signature,
        props.elements[0].name,
        props.collectionData,
      ),
    );
  };

  /** methods call when signature activity is started */
  const handleBegin = () => {
    dispatch(formAction.makeScrollDisableWhenSignaturePadIsActive());
  };

  /** methods call when clear button is clicked */
  const handleClear = () => {
    ref.current.clearSignature();
    setSignatureImageUri(null);
    dispatch(formAction.makeScrollAbleWhenSignaturePadIsInActive());
    dispatch(
      formAction.updateDataOfInputAfterTypingByUser(
        '',
        props.elements[0].name,
        props.collectionData,
      ),
    );
  };

  /** methods call when signature activity ended is clicked */
  const handleEnd = () => {
    dispatch(formAction.makeScrollAbleWhenSignaturePadIsInActive());
    ref.current.readSignature();
  };

  return (
    <ScrollView style={styles.mainView} scrollEnabled={false}>
      <View style={styles.signatureLabelHolder}>
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.titleLight
              : styles.titleDark
          }>
          {props.elements[0].required === true ? (
            <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
          ) : (
            ''
          )}
          {props.elements[0].label[formReducer.activeFormLanguage]}
        </Text>
        <Pressable onPress={() => handleClear()}>
          <View style={styles.tickHolderContainer}>
            <Image
              style={
                themeState?.activeTheme === 'light'
                  ? styles.deleteLight
                  : styles.delete
              }
              source={require('../../../assets/images/delete.png')}
            />
          </View>
        </Pressable>
      </View>
      <View
        style={
          themeState?.activeTheme === 'light'
            ? styles.containerLight
            : styles.container
        }>
        <Signature
          ref={ref}
          onOK={handleOK}
          onBegin={handleBegin}
          onEnd={handleEnd}

          //          dataUrl={signatureImageUri}
        />
        {signatureImageUri != null && signatureImageUri != '' ? (
          <View style={{height: '100%', width: '100%'}}>
            <Image
              resizeMode={'contain'}
              style={styles.imageSignature}
              source={{
                uri: Array.isArray(signatureImageUri)
                  ? signatureImageUri[props.collectionData[0].activeIndex]
                  : signatureImageUri,
              }}
            />
          </View>
        ) : (
          ''
        )}
      </View>
      {/* {signatureImageUri == null ||
      signatureImageUri == '' ||
      signatureImageUri == '' ? (
        ''
      ) : (
        <View>
          <Image
            resizeMode={'contain'}
            style={styles.imageSignature}
            source={{
              uri: Array.isArray(signatureImageUri)
                ? signatureImageUri[props.collectionData[0].activeIndex]
                : signatureImageUri,
            }}
          />
        </View>
      )} */}
      <Text style={styles.errorText}>{errorMessage}</Text>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    width: '100%',
  },
  delete: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  },
  deleteLight: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
    backgroundColor: '#515151',
    borderRadius: 10,
  },
  signatureLabelHolder: {
    marginVertical: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  titleLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 20 : 14,
    color: '#1a1a1a',
  },
  titleDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 20 : 14,
    color: '#EAEAEA',
  },

  containerLight: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '92%',
    borderColor: '#1a1a1a',
    borderWidth: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '92%',
    borderColor: '#fff',
    borderWidth: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // row: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  imageSignature: {
    width: '100%',
    height: '90%',
    backgroundColor: '#EAEAEA',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: Platform.isPad === true ? 18 : 14,
  },
});
