import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  BarcodeValueType,
} from 'vision-camera-code-scanner';
import {CustomButton} from '../../../components';
import GlobalStyle from '../../../style/globalstyle';
import {parse} from '../vCardNew.js';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

export default function BarcodeElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const [hasPermission, setHasPermission] = useState(false);
  const [visible, setVisible] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [scanningIsInProgress, setScanningIsInProgress] = useState(false);
  const [barcodeReturnedData, setBarcodeReturnedData] = useState(null);

  useEffect(() => {
    let ll = `Barcode {"content": {"data": {"addresses": [Array], "emails": [Array], "name": [Object], "organization": "simlea GmbH", "phones": [Array], "title": "Managing Director", "urls": [Array]}, "type": 1}, "cornerPoints": [{"x": 342, "y": 774}, {"x": 620, "y": 775}, {"x": 611, "y": 1028}, {"x": 365, "y": 1026}], "displayValue": "Oliver Edinger", "format": 256, "rawValue": "BEGIN:VCARD
VERSION:3.0
N:Edinger;Oliver
FN:Oliver Edinger
TITLE:Managing Director
ORG:simlea GmbH
URL:https://www.simlea.com
mailto:email;type=internet:oliver.edinger@simlea.com
TEL;TYPE=voice,work,pref:+49 6203 6799 871
TEL;TYPE=voice,cell,pref:+49 163 5979432
ADR:;;Boveriestr. 15;Ladenburg;;68526;Deutschland
END:VCARD"}`;

    //console.log('barcodeReturnedData', barcodeReturnedData);
    if (barcodeReturnedData != null) {
      //console.log('parse(ll)');
      let parsedData = parse(ll);
      dataFromCard(parsedData);

      function dataFromCard(parsedData) {
        // let card = vCard.parse(parsedData);
        let card = parsedData;
        // //console.log(card);

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
            } catch (em) {
              // //console.log("processVcardField error", em);
            }
            if (typeof item.value == 'string') {
              text += item.value + '\n';
            } else if (Array.isArray(item.value)) {
              if (key == 'adr') {
                text += obj['Address'] + '\n';
              } else {
                text += item.value.join(',') + '\n';
              }
            }
          });
        });

        //console.log(obj);

        let street = obj['Address.StreetAddress'];
        let houseNr = '';

        if (typeof street == 'string') {
          let match = street.match(/(.*\S)\s+(\d+.*)/);
          if (match) {
            street = match[1];
            houseNr = match[2];
          }
        }

        let data: any = {
          name: obj['Name'],
          fullname: obj['Name'],
          firstname: obj['Name.FirstName'],
          lastname: obj['Name.LastName'],
          title: obj['Name.Title'],
          position: obj['Job.JobPosition'],
          department: obj['Job.JobDepartment'],
          street: obj['Address.StreetAddress'],
          city: obj['Address.ZipCode'] + ' ' + obj['Address.City'],
          country: obj['Address.Country'],
          email: obj['Email'],
          phone: obj['Phone'],
          fax: obj['Fax'],
          mobile: obj['Mobile'],
          company: obj['Company'],
          web: obj['Web'],
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
          if (typeof v == 'string') {
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
        //   ),
        // );
        console.log('Unmapped data', data);
        let mappedData = getMappedData(data);
        // console.log(mappedData);
        // mappedData._text = data._text;
        // console.log(mappedData);

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
        console.log('Mapped data', data);
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
            if (field['meta']) {
              if (field['meta'].hasOwnProperty('type')) {
                if (field['meta']['type'].length) {
                  meta = field['meta']['type'][0];
                  types = meta.toLowerCase().split(',');
                }
              } else {
                for (let i in field['meta']) {
                  if (field['meta'].hasOwnProperty(i)) {
                    types.push(i.toLowerCase());
                  }
                }
              }
            }

            if (types.indexOf('fax') !== -1) {
              // it's a fax number
              result['Fax'] = field['value'];
            } else if (types.indexOf('cell') !== -1) {
              // mobile number
              result['Mobile'] = field['value'];
            } else if (!result['Phone']) {
              // regular phone number
              result['Phone'] = field['value'];
            }
            break;
          case 'org':
            v = Array.isArray(field['value'])
              ? field['value'][0]
              : field['value'];
            result['Company'] = result['Company'] || v;
            break;
          case 'url':
            result['Web'] = field['value'];
            break;
          case 'fn':
            v = Array.isArray(field['value'])
              ? field['value'][0]
              : field['value'];
            result['Name'] = result['Name'] || v;
            break;
          case 'email':
            result['Email'] = field['value'];
            break;
          case 'n':
            if (!result['_nameProcessed']) {
              v = Array.isArray(field['value'])
                ? field['value']
                : [field['value']];
              v.length > 0 && (result['Name.LastName'] = v[0]);
              v.length > 1 && (result['Name.FirstName'] = v[1]);
              v.length > 2 && (result['Name.MiddleName'] = v[2]);
              v.length > 3 && (result['Name.Title'] = v[3]);
              result['_nameProcessed'] = true;
            }
            break;
          case 'adr':
            let tmp = [];
            if (!Array.isArray(field['value'])) {
              field['value'] = [field['value']];
            }
            let arr = field['value'];
            //console.log(arr);
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
                    //console.log(parts);
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

            field['value'].forEach(function (v) {
              v.length && tmp.push(v);
            });
            result['Address'] = tmp.join('\n');
            break;
          case 'title':
            if (Array.isArray(field['value'])) {
              result['Job.JobPosition'] = field['value'][0];
              result['Job.JobDepartment'] = field['value'][1];
            } else {
              result['Job.JobPosition'] =
                result['Job.JobPosition'] || field['value'];
            }
            break;
        }
      }
    }
  }, [barcodeReturnedData]);

  const [frameProcessor, barcodes] = useScanBarcodes(
    //  [BarcodeFormat.ALL_FORMATS], [BarcodeValueType.TEXT],
    [BarcodeFormat.ALL_FORMATS],
    {
      checkInverted: true,
    },
  );

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (barcodes.length > 0) {
      setVisible(false);
      setBarcodeReturnedData(barcodes[0]);
      //console.log('Barcodes', barcodes[0]);
    }
  }, [barcodes]);
  //console.log('Barcode', barcodes[0]);
  return (
    <View style={{marginTop: 17, width: '100%'}}>
      {device != null && hasPermission && (
        <Modal
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(false);
          }}>
          <Camera
            style={styles.scan}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
            audio={false}
          />
          <CustomButton
            title="Cancel"
            style={styles.cancelButton}
            size={30}
            onPress={hideModal}
          />
        </Modal>
      )}
      {/* {barcodes.map((barcode, id) => {
        return {
          /* <Text key={id} style={styles.barcodeTextURL}>
            {barcode.rawValue}
          </Text> 
        };
      })} */}
      <View style={styles.scanButton}>
        <CustomButton
          title="Scan QR-Code"
          style={styles.scanCardButton}
          labelStyle={styles.btnText}
          onPress={showModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scan: {
    justifyContent: 'center',
    marginTop: 26,
    height: '90%',
    width: '100%',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#30C6EA',
    borderRadius: 3,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  scanCardButton: {
    height: 40,
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#30C6EA',
    backgroundColor: '#30C6EA',
  },
  btnText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'center',
    color: '#FBFBFB',
  },
  scanButton: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
});
