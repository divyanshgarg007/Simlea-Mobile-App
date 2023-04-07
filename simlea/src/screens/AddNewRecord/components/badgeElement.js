import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {CustomButton} from '../../../components';
import {useDispatch, useSelector} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';
import * as formServices from '../../../services/formServices';
import GlobalStyle from '../../../style/globalstyle';

export default function BadgeElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  function callApiMethod() {
    // console.log("callApiMethod");
    const responseData = formServices
      .getDataForBadgeElementBasedOnTicketId(146419129051)
      .then(response => {
        //console.log(response.data);
        //console.log(Object.keys(response.data));
        let obj = {};
        Object.keys(response.data).forEach(eachKey => {
          obj[eachKey] = response.data[eachKey].value;
        });
        //   dispatch(formAction.updateValuesOfOCRAndBadgeAndBarcodeElement(obj));
        //console.log(obj);
      })
      .catch(err => {
        // console.log(err.response.data);
        // console.log('error occured in badge element api call');
      });
  }

  useEffect(() => {
    /** below lines are used to fetch badge data from backend  based on the ticket id*/
    // const responseData = formServices
    //   .getDataForBadgeElementBasedOnTicketId(146419129051)
    //   .then(response => {
    //     console.log(response.data);
    //     console.log(Object.keys(response.data));
    //     let obj = {};
    //     Object.keys(response.data).forEach((eachKey) => {
    //       obj[eachKey] = response.data[eachKey].value;
    //     })
    //     //   dispatch(formAction.updateValuesOfOCRAndBadgeAndBarcodeElement(obj));
    //     //console.log(obj);
    //   })
    //   .catch((err) => {
    //     console.log(err.response.data);
    //     console.log("error occured in badge element api call");
    //   });
  }, []);

  return (
    <View style={styles.scanButton}>
      <CustomButton
        title="Scan Badge Barcode"
        placeholder={props.elements[0].label[formReducer.activeFormLanguage]}
        style={styles.scanCardButton}
        labelStyle={styles.btnText}
        onPress={callApiMethod}
      />
      {/* <TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 13,
            color: '#000',
          }}></Text>
      </TouchableOpacity> */}
    </View>
  );
}

export const styles = StyleSheet.create({
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
