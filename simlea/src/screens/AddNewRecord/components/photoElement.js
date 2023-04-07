import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { CustomButton } from '../../../components';
import Close from '../../../assets/images/closes.png';
import { NAVIGATION } from '../../../constants';
import cameo from '../../../assets/images/camera-light.png';
import GlobalStyle from '../../../style/globalstyle';
import { useSelector, useDispatch } from 'react-redux';
import * as formServices from '../../../services/formServices';
import * as formAction from '../../../redux/action/formAction';
import * as formActionService from '../../../database/FormActionDataService';
import { DocumentDirectoryPath } from 'react-native-fs';

export default function CardElement(props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [filePath, setFilePath] = useState('');
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (filePath == '' || filePath == null) {
        setErrorMessage('This field is required');
      }
    }
  }, [formReducer.showFormElementsError, filePath]);

  const openCamera = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };
  };

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData == 'undefined') {
        setFilePath(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setFilePath(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
          props.collectionData[0].activeIndex
          ],
        );

       
      }
    } else {
      setFilePath(null);
    }
  }, [
    typeof props.collectionData == 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  // const captureImage = async type => {
  //   let options = {
  //     mediaType: type,
  //     maxWidth: 400,
  //     maxHeight: 550,
  //     quality: 1,
  //     saveToPhotos: true,
  //   };
  //   // let isCameraPermitted = await requestCameraPermission();
  //   // let isStoragePermitted = await requestExternalWritePermission();
  //   // if (isCameraPermitted && isStoragePermitted) {
  //   launchCamera(options, response => {
  //     if (response.errorCode == 'camera_unavailable') {
  //       alert('Camera not available on device');
  //       return;
  //     } else if (response.errorCode == 'permission') {
  //       alert('Permission not satisfied');
  //       return;
  //     } else if (
  //       response.errorCode == response.didCancel &&
  //       typeof response.didCancel != 'undefined'
  //     ) {
  //       alert('User cancelled image picker');
  //       return false;
  //     } else if (response.errorCode == 'others') {
  //       alert(response.errorMessage);
  //       return;
  //     } else {
  //       if (typeof props.collectionData == 'undefined') {
  //         setFilePath(response.assets[0].uri);
  //       } else {
  //         let tempArray = [];
  //         tempArray[props.collectionData[0].activeIndex] =
  //           response.assets[0].uri;
  //         setFilePath(tempArray);
  //       }
  //       toggleOverlay();
  //     }
  //   });
  //   // }
  // };

  // const chooseFile = type => {
  //   let options = {
  //     mediaType: type,
  //     maxWidth: 400,
  //     maxHeight: 550,
  //     quality: 1,
  //   };
  //   launchImageLibrary(options, response => {
  //     if (response.errorCode == 'camera_unavailable') {
  //       alert('Camera not available on device');
  //       return;
  //     } else if (response.errorCode == 'permission') {
  //       alert('Permission not satisfied');
  //       return;
  //     } else if (response.didCancel) {
  //       alert('User cancelled image picker');
  //       return;
  //     } else if (response.errorCode == 'others') {
  //       alert(response.errorMessage);
  //       return;
  //     } else {
  //       dispatch(
  //         formAction.updateDataOfInputAfterTypingByUser(
  //           response.assets[0].uri,
  //           props.elements[0].name,
  //           props.collectionData,
  //         ),
  //       );
  //       if (typeof props.collectionData == 'undefined') {
  //         setFilePath(response.assets[0].uri);
  //       } else {
  //         let tempArray = [];
  //         tempArray[props.collectionData[0].activeIndex] =
  //           response.assets[0].uri;
  //         setFilePath(tempArray);
  //       }
  //       toggleOverlay();
  //     }
  //   });
  // };

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 550,
      cropping: true,
    })
      .then(image => {
        if (typeof props.collectionData == 'undefined') {
          
          setFilePath(image.path);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              image.path,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        } else {
          let tempArray = [];
          tempArray[props.collectionData[0].activeIndex] = image.path;
          setFilePath(tempArray);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              tempArray,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }
      })
      .finally(toggleOverlay);
  };
  const captureImage = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 550,
      cropping: true,
    })
      .then(async image => {
        // let imageUploadAndGetPath = await formActionService.getImagePathAndUploadItLocaly(image.path);
        // console.log(imageUploadAndGetPath)
        if (typeof props.collectionData == 'undefined') {
          setFilePath(image.path);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              image.path,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        } else {
          let tempArray = [];
          tempArray[props.collectionData[0].activeIndex] = image.path;
          setFilePath(tempArray);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              tempArray,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }
      })
      .finally(toggleOverlay);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View style={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeBox}
              onPress={() => toggleOverlay()}>
              <Image source={Close} style={styles.closeIcon} />
            </TouchableOpacity>
            <CustomButton
              style={styles.buttonStyle}
              labelStyle={styles.actionTitle}
              title="Take Picture"
              onPress={() => captureImage()}
            />
            <CustomButton
              style={styles.cancelButtonStyle}
              labelStyle={styles.actionTitle}
              title="Choose Image From Gallery"
              onPress={() => chooseImage()}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.mainView}>
        {props.elements[0].required === true ? (
          <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
        ) : (
          ''
        )}
        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.imageWithDeleteBoxLight
              : styles.imageWithDeleteBox
          }>
          <Image
            source={
              filePath === ''
                ? cameo
                : {
                  uri: Array.isArray(filePath)
                    ? filePath[props.collectionData[0].activeIndex]
                    : filePath,
                }
            }
            style={filePath === '' ? styles.defaultImage : styles.imageStyle}
          />
        </View>
        <CustomButton
          title="Take Picture"
          style={styles.scanCardButton}
          labelStyle={styles.btnText}
          onPress={() => toggleOverlay()}
        />
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    </>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    paddingVertical: 18,
  },
  scanCardButton: {
    height: Platform.isPad === true ? 61 : 40,
    justifyContent: 'center',
    borderRadius: Platform.isPad === true ? 6 : 3,
    borderWidth: 1,
    borderColor: '#30C6EA',
    marginTop: 15,
    backgroundColor: '#30C6EA',
  },
  btnText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 12,
    textAlign: 'center',
    color: '#FBFBFB',
  },
  imageWithDeleteBoxLight: {
    borderColor: '#8F92A133',
    borderWidth: 1,
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWithDeleteBox: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    margin: 5,
    resizeMode: 'cover',
  },

  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 25,
    position: 'relative',
  },
  closeBox: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonStyle: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: Platform.isPad === true ? 57 : 44,
    marginTop: 25,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginTop: Platform.isPad === true ? 16 : 10,
  },
  cancelButtonStyle: {
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    width: '100%',
    height: Platform.isPad === true ? 57 : 44,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: 15,
  },
});
