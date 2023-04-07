/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
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
import {CustomButton} from '../../../components';
import {NAVIGATION} from '../../../constants';
import cameo from '../../../assets/images/camera-light.png';
import {IconButton} from 'react-native-paper';
import Close from '../../../assets/images/closes.png';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector, useDispatch} from 'react-redux';
import * as formServices from '../../../services/formServices';
import * as formAction from '../../../redux/action/formAction';
import {parse} from '../vcard.js';
import {LanguageConstants} from './languageConstants';

export default function CardElement(props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [modalVisibleLanguage, setModalVisibleLanguage] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [filePath, setFilePath] = useState('');
  const [canCallFineReaderAbby, setTrueCallForFineReaderAbby] = useState(false);

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (filePath == '' || filePath == null) {
        setErrorMessage('This field is required');
      }
    }
  }, [formReducer.showFormElementsError, filePath]);

  useEffect(() => {
    setTrueCallForFineReaderAbby(false);
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
  ]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
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
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  const openCamera = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };
  };

  useEffect(() => {
    console.log('canCallFineReaderAbby is executed');
    if (
      filePath != null &&
      filePath.length > 0 &&
      filePath != '' &&
      canCallFineReaderAbby == true
    ) {
      let parsedData = {
        version: '2.1',
        tel: [
          {
            meta: {CHARSET: 'utf-8', TYPE1: 'WORK', TYPE2: 'VOICE'},
            value: ['+49 (6203) 6799871'],
          },
          {
            meta: {CHARSET: 'utf-8', TYPE1: 'CELL', TYPE2: 'VOICE'},
            value: ['+ mailto:491635979432'],
          },
        ],
        email: [
          {
            meta: {charset: 'utf-8'},
            value: [' mailto:oliver.edinger@simlea.com '],
          },
        ],
        url: [
          {
            meta: {CHARSET: 'utf-8', TYPE1: 'WORK'},
            value: [' https://www.simlea.com '],
          },
        ],
        label: [
          {
            meta: {CHARSET: 'utf-8', TYPE1: 'WORK'},
            value: ['Boveristraße1568526Ladenburg'],
          },
        ],
        adr: [
          {
            meta: {CHARSET: 'utf-8', TYPE1: 'WORK'},
            value: ['', '', 'Boveristraße15', 'Ladenburg', '', '68526', ''],
          },
        ],
        n: [
          {meta: {CHARSET: 'utf-8'}, value: ['Edinger', 'Oliver', '', '', '']},
        ],
        fn: [{meta: {CHARSET: 'utf-8'}, value: ['OliverEdinger']}],
        org: [
          {meta: {CHARSET: 'utf-8'}, value: ['simlea GmbH']},
          {meta: {CHARSET: 'utf-8'}, value: ['simlea']},
        ],
        title: [{meta: {CHARSET: 'utf-8'}, value: ['ManagingDirector']}],
        note: [
          {
            meta: {ENCODING: 'QUOTED-PRINTABLE', CHARSET: 'utf-8'},
            value: ['Oliver=0D=0A='],
          },
        ],
      };
      //    dataFromCard(parsedData)

      function dataFromCard(parsedData) {
        // let card = vCard.parse(parsedData);
        let card = parsedData;

        let text = '';

        let keys = ['n', 'fn', 'title', 'org', 'adr', 'tel', 'email', 'url'];

        let obj = getEmptyObject();

        keys.forEach(key => {
          if (!card.hasOwnProperty(key) || !Array.isArray(card[key])) {
            return;
          }
          card[key].forEach(item => {
            try {
              //this.processVcardField(item, key, obj);
              processVcardField(item, key, obj);
            } catch (em) {}
            if (typeof item.value === 'string') {
              text += item.value + '\n';
            } else if (Array.isArray(item.value)) {
              if (key == 'adr') {
                text += obj.Address + '\n';
              } else {
                text += item.value.join(',') + '\n';
              }
            }
          });
        });

        let street = obj['Address.StreetAddress'];
        let houseNr = '';

        if (typeof street === 'string') {
          let match = street.match(/(.*\S)\s+(\d+.*)/);
          if (match) {
            street = match[1];
            houseNr = match[2];
          }
        }

        let data: any = {
          name: obj.Name,
          fullname: obj.Name,
          firstname: obj['Name.FirstName'],
          lastname: obj['Name.LastName'],
          title: obj['Name.Title'],
          position: obj['Job.JobPosition'],
          department: obj['Job.JobDepartment'],
          street: obj['Address.StreetAddress'],
          city: obj['Address.ZipCode'] + ' ' + obj['Address.City'],
          country: obj['Address.Country'],
          email: obj.Email,
          phone: obj.Phone,
          fax: obj.Fax,
          mobile: obj.Mobile,
          company: obj.Company,
          web: obj.Web,
          zip: obj['Address.ZipCode'],
          city_only: obj['Address.City'],
          number: houseNr,
          street_only: street,
          _text: text,
        };

        for (let i in data) {
          if (!data.hasOwnProperty(i)) {
            continue;
          }
          let v = data[i];
          if (typeof v === 'string') {
            v = v.trim();
            if (!v.length) {
              delete data[i];
            }
          } else {
            delete data[i];
          }
        }

        // dispatch(
        //   formAction.updateValuesOfOCRAndBadgeAndBarcodeElement(
        //     data,
        //     props.collectionData,
        //     formReducer.liveFormDataElements,
        //     props.elements
        //   ),
        // );
        let mappedData = getMappedData(data);
        // mappedData._text = data._text;
        // return mappedData;
      }

      function getMappedData(data) {
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
        //console.log('Mapped data', data);
        dispatch(
          formAction.updateValuesOfOCRAndBadgeAndBarcodeElement(
            data,
            props.collectionData,
            formReducer.liveFormDataElements,
          ),
        );
        return data;
      }

      function getEmptyObject() {
        return {
          Name: '',
          'Name.FirstName': '',
          'Name.LastName': '',
          'Name.MiddleName': '',
          'Name.ExtraName': '',
          'Name.Title': '',
          Phone: '',
          'Phone.PhonePrefix': '',
          'Phone.PhoneCountryCode': '',
          'Phone.PhoneCode': '',
          'Phone.PhoneBody': '',
          'Phone.PhoneExtension': '',
          Mobile: '',
          'Mobile.PhonePrefix': '',
          'Mobile.PhoneCountryCode': '',
          'Mobile.PhoneCode': '',
          'Mobile.PhoneBody': '',
          'Mobile.PhoneExtension': '',
          Fax: '',
          'Fax.PhonePrefix': '',
          'Fax.PhoneCountryCode': '',
          'Fax.PhoneCode': '',
          'Fax.PhoneBody': '',
          'Fax.PhoneExtension': '',
          Company: '',
          Job: '',
          'Job.JobPosition': '',
          'Job.JobDepartment': '',
          Address: '',
          'Address.ZipCode': '',
          'Address.Country': '',
          'Address.City': '',
          'Address.StreetAddress': '',
          Email: '',
          Web: '',
          Text: '',
        };
      }

      function processVcardField(field: {}, key: string, result: {}) {
        let v;
        switch (key) {
          case 'tel':
            let meta = '';
            let types = [];
            if (field.meta) {
              if (field.meta.hasOwnProperty('type')) {
                if (field.meta.type.length) {
                  meta = field.meta.type[0];
                  types = meta.toLowerCase().split(',');
                }
              } else {
                for (let i in field.meta) {
                  if (field.meta.hasOwnProperty(i)) {
                    types.push(i.toLowerCase());
                  }
                }
              }
            }

            if (types.indexOf('fax') !== -1) {
              // it's a fax number
              result.Fax = field.value;
            } else if (types.indexOf('cell') !== -1) {
              // mobile number
              result.Mobile = field.value;
            } else if (!result.Phone) {
              // regular phone number
              result.Phone = field.value;
            }
            break;
          case 'org':
            v = Array.isArray(field.value) ? field.value[0] : field.value;
            result.Company = result.Company || v;
            break;
          case 'url':
            result.Web = field.value;
            break;
          case 'fn':
            v = Array.isArray(field.value) ? field.value[0] : field.value;
            result.Name = result.Name || v;
            break;
          case 'email':
            result.Email = field.value;
            break;
          case 'n':
            if (!result._nameProcessed) {
              v = Array.isArray(field.value) ? field.value : [field.value];
              v.length > 0 && (result['Name.LastName'] = v[0]);
              v.length > 1 && (result['Name.FirstName'] = v[1]);
              v.length > 2 && (result['Name.MiddleName'] = v[2]);
              v.length > 3 && (result['Name.Title'] = v[3]);
              result._nameProcessed = true;
            }
            break;
          case 'adr':
            let tmp = [];
            if (!Array.isArray(field.value)) {
              field.value = [field.value];
            }
            let arr = field.value;
            for (let i = 0; i < arr.length; ++i) {
              let v = arr[i];

              if (!v.length) {
                continue;
              }

              switch (i) {
                case 0:
                  result['Address.StreetAddress'] = v;
                  if (arr.length === 1) {
                    let parts = v.replace(/\W{2,}/g, '  ').split('  ');
                    for (let j = parts.length - 1; j >= 0; --j) {
                      if (!parts[j].trim().length) {
                        parts.splice(j, 1);
                      }
                    }
                    result['Address.StreetAddress'] = parts[0];
                    if (parts.length > 1) {
                      result['Address.City'] = parts[1];

                      let match = parts[1].match(/\W*(\d{4,})\W*/);
                      if (match) {
                        let p = parts[1].split(match[0]);
                        result['Address.City'] =
                          p.length > 1 && p[1].length > p[0].length
                            ? p[1]
                            : p[0]; // parts[1].replace(match[0], '');
                        result['Address.ZipCode'] = match[1];
                      }
                    } else {
                      // try to find a ZIP-code and split
                      let match = v.match(/\W*(\d{4,})\W*/);
                      if (match) {
                        let p = v.split(match[0]);
                        result['Address.ZipCode'] = match[1];
                        result['Address.StreetAddress'] = p[0];
                        result['Address.City'] = p[1];
                      }
                    }
                  }
                  break;
                case 2:
                  // actually for city
                  // but sometimes street address + city is in this field
                  let streetParts = v.replace(/[^\w.]{2,}/g, '  ').split('  ');
                  if (!arr[0].length && streetParts.length > 1) {
                    result['Address.StreetAddress'] = streetParts[0];
                    result['Address.City'] = streetParts[1];
                  } else {
                    if (arr.length > 3 && arr[3] && arr[3].length) {
                      result['Address.StreetAddress'] = v;
                    } else {
                      result['Address.City'] = v;
                    }
                  }

                  break;
                case 3:
                  result['Address.City'] = v;
                  break;
                case 5:
                  result['Address.ZipCode'] = v;
                  break;
                case 6:
                  result['Address.Country'] = v;
                  break;
              }
            }

            field.value.forEach(function (v) {
              v.length && tmp.push(v);
            });
            result.Address = tmp.join('\n');
            break;
          case 'title':
            if (Array.isArray(field.value)) {
              result['Job.JobPosition'] = field.value[0];
              result['Job.JobDepartment'] = field.value[1];
            } else {
              result['Job.JobPosition'] =
                result['Job.JobPosition'] || field.value;
            }
            break;
        }
      }

      let uri = Array.isArray(filePath)
        ? filePath[props.collectionData[0].activeIndex]
        : filePath;
      if (uri.length > 0) {
        const responseData = formServices
          .getCardDataFromAbbyFineReader(uri)
          .then(response => {
            let parsedData2 = parse(response.data.vcard);
            dataFromCard(parsedData2);
          })
          .catch(err => {});
      }
    }
  }, [filePath, props.collectionData[0].activeIndex, canCallFineReaderAbby]);

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 550,
      cropping: true,
    })
      .then(image => {
        if (typeof props.collectionData === 'undefined') {
          setTrueCallForFineReaderAbby(true);
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
          setTrueCallForFineReaderAbby(true);

          // tempArray[props.collectionData[0].activeIndex] = image.path;
          setFilePath(image.path);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              image.path,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }
        // if (typeof props.collectionData == 'undefined') {
        //   setFilePath(image.path);
        // } else {
        //   let tempArray = [];
        //   tempArray[props.collectionData[0].activeIndex] = image.path;
        //   setFilePath(tempArray);
        // }
      })
      .finally(toggleOverlay);
  };
  const captureImage = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 550,
      cropping: true,
    })
      .then(image => {
        if (typeof props.collectionData === 'undefined') {
          setTrueCallForFineReaderAbby(true);
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
          setTrueCallForFineReaderAbby(true);
          tempArray[props.collectionData[0].activeIndex] = image.path;
          setFilePath(image.path);
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              image.path,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }
        // if (typeof props.collectionData === 'undefined') {
        //   setFilePath(image.path);
        // } else {
        //   let tempArray = [];
        //   tempArray[props.collectionData[0].activeIndex] = image.path;
        //   setFilePath(tempArray);
        // }
      })
      .finally(toggleOverlay);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const showLanguage = () => {
    setModalVisibleLanguage(!modalVisibleLanguage);
  };

  return (
    <>
      <Modal
        animationType="slide"
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
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.cardNameLight
              : styles.cardName
          }>
          Business card front
        </Text>
        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.imageWithDeleteBoxLight
              : styles.imageWithDeleteBox
          }>
          <Image
            source={
              filePath == '' || filePath == null
                ? cameo
                : {
                    //       //   uri: Array.isArray(filePath)
                    //       //     ? filePath[props.collectionData[0].activeIndex]
                    //       //     : filePath,
                    uri: filePath,
                  }
            }
            style={
              filePath == '' || filePath == null
                ? styles.defaultImage
                : styles.imageStyle
            }
          />
        </View>
        <View style={styles.buttonGroup}>
          <CustomButton
            title="Scan Business Card"
            style={styles.scanCardButton}
            labelStyle={styles.btnText}
            onPress={() => toggleOverlay()}
          />
          <CustomButton
            title="1"
            icon={require('../../../assets/images/globe.png')}
            style={styles.scanCardButtonGlobe}
            labelStyle={styles.btnTextGlobe}
            onPress={() => showLanguage()}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleLanguage}
        onRequestClose={() => {
          setModalVisibleLanguage(!modalVisibleLanguage);
        }}>
        <View style={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <LanguageConstants />
            <CustomButton
              style={styles.buttonStyle}
              labelStyle={styles.actionTitle}
              title="OK"
              onPress={() => showLanguage()}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  scanCardButton: {
    height: 40,
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#30C6EA',
    backgroundColor: '#30C6EA',
    width: Platform.OS === 'android' ? '70%' : '100%',
  },
  scanCardButtonGlobe: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#30C6EA',
    backgroundColor: '#30C6EA',
    width: Platform.OS === 'android' ? '20%' : '100%',
  },
  btnText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'center',
    color: '#FBFBFB',
  },
  btnTextGlobe: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    textAlign: 'center',
    color: '#FBFBFB',
    justifyContent: 'center',
    lineHeight: Platform.OS === 'ios' ? 0 : 18,
  },
  cardName: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#EAEAEA',
    paddingBottom: 5,
  },
  cardNameLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#1a1a1a',
    paddingBottom: 5,
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
  spaceBtns: {
    flex: 0,
    flexBasis: '31%',
  },
  buttonStyle: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: 44,
    marginTop: 25,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
  },
  cancelButtonStyle: {
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    width: '100%',
    height: 44,
    marginTop: 20,
  },
});
