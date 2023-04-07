/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';
import DeleteWhite from '../../../assets/images/white-back.png';
import DeleteDark from '../../../assets/images/black-back.png';

export default function CalculatorElement(props) {
  const themeState = useSelector(
    (state) => state.rootReducers?.appComponentReducer
  );

  //console.log(Array.from(String(12345),  parseInt));

  const [currentStringArrayHolder, setCurrentStringArrayHolder] = useState([]);
  const [backButtonIsActive, setBackButtonIsActive] = useState(false);
  const [resultHolder, setResultHolder] = useState(null);

  const handleInput = (input) => {
    if (input == '*' || input == '+' || input == '-' || input == '/') {

      if (currentStringArrayHolder.length > 0) {
        let arr = [...currentStringArrayHolder];
        arr.push(input);
        setCurrentStringArrayHolder(arr);
        setBackButtonIsActive(true);


      }
      else {
        if (resultHolder == null) {
          let arr = [];
          arr[0] = 0;
          arr[1] = input;
          setCurrentStringArrayHolder(arr);
          setBackButtonIsActive(true);
        }
        else {
          let arr = Array.from(String(resultHolder));
          arr.push(input)
          setCurrentStringArrayHolder(arr);
          setBackButtonIsActive(true);
          setResultHolder(null);
        }
      }

    }
    if (input >= 0 || input <= 9) {
      let arr = [...currentStringArrayHolder];
      arr.push(input);
      setCurrentStringArrayHolder(arr);
      setBackButtonIsActive(true);
      setResultHolder(null);

    }

    if (input == '.') {
      if (resultHolder == null) {
        let arr = [...currentStringArrayHolder];
        arr.push(input);
        setCurrentStringArrayHolder(arr);
        setBackButtonIsActive(true);
      }
      else {
        let arr = [];
        arr[0] = 0;
        arr[1] = input;
        setCurrentStringArrayHolder(arr);
        setBackButtonIsActive(true);
        setResultHolder(null);

      }

    }


  };
  const calculateResult = () => {
    setBackButtonIsActive(false);
    let arr2 = [...currentStringArrayHolder];
    let decimalExist = false;
    let currentSignHolder = null;
    let currentElementBeforeDecimal = 0;
    let currentElementAfterDecimal = 0;
    let currentCalculationResult = 0;

    for (i = 0; i <= arr2.length - 1; i++) {
      if (arr2[i] == '*' || arr2[i] == '/' || arr2[i] == '+' || arr2[i] == '-') {

        if (currentSignHolder == null) {
          currentSignHolder = arr2[i];
          if (currentElementAfterDecimal > 0) {
            currentCalculationResult = parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
          }
          else {
            currentCalculationResult = parseInt(currentElementBeforeDecimal);
          }
          currentElementBeforeDecimal = 0;
          currentElementAfterDecimal = 0;
          decimalExist = false;

        }
        else {
          if (currentSignHolder == '*') {
            if (currentElementAfterDecimal > 0) {
              currentCalculationResult = currentCalculationResult * parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
            }
            else {
              currentCalculationResult = currentCalculationResult * parseInt(currentElementBeforeDecimal);
            }
            currentElementBeforeDecimal = 0;
            currentElementAfterDecimal = 0;
            decimalExist = false;
          }
          if (currentSignHolder == '+') {
            if (currentElementAfterDecimal > 0) {
              currentCalculationResult = currentCalculationResult + parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
            }
            else {
              currentCalculationResult = currentCalculationResult + parseInt(currentElementBeforeDecimal);
            }

            currentElementBeforeDecimal = 0;
            currentElementAfterDecimal = 0;
            decimalExist = false;
          }
          if (currentSignHolder == '-') {

            if (currentElementAfterDecimal > 0) {
              currentCalculationResult = currentCalculationResult - parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
            }
            else {
              currentCalculationResult = currentCalculationResult - parseInt(currentElementBeforeDecimal);
            }
            currentElementBeforeDecimal = 0;
            currentElementAfterDecimal = 0;
            decimalExist = false;
          }
          if (currentSignHolder == '/') {

            if (currentElementAfterDecimal > 0) {
              currentCalculationResult = currentCalculationResult / parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
            }
            else {
              currentCalculationResult = currentCalculationResult / parseInt(currentElementBeforeDecimal);
            }
            currentElementBeforeDecimal = 0;
            currentElementAfterDecimal = 0;
            decimalExist = false;
          }
          currentSignHolder = arr2[i];
        }
      }



      if (arr2[i] >= 0 || arr2[i] <= 9) {
        if (decimalExist == true) {
          currentElementAfterDecimal = (currentElementAfterDecimal * 10) + parseInt(arr2[i]);
        }
        else {
          currentElementBeforeDecimal = (currentElementBeforeDecimal * 10) + parseInt(arr2[i]);

        }
      }
      if (arr2[i] == '.') {
        decimalExist = true;

      }

      if (i == arr2.length - 1) {
        if (currentSignHolder == '+') {
          if (currentElementAfterDecimal > 0) {
            currentCalculationResult = currentCalculationResult + parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
          }
          else {
            currentCalculationResult = currentCalculationResult + parseInt(currentElementBeforeDecimal);
          }
        }
        if (currentSignHolder == '-') {
          if (currentElementAfterDecimal > 0) {
            currentCalculationResult = currentCalculationResult - parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
          }
          else {
            currentCalculationResult = currentCalculationResult - parseInt(currentElementBeforeDecimal);
          }
        }
        if (currentSignHolder == '*') {
          if (currentElementAfterDecimal > 0) {
            currentCalculationResult = currentCalculationResult * parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
          }
          else {
            currentCalculationResult = currentCalculationResult * parseInt(currentElementBeforeDecimal);
          }
        }
        if (currentSignHolder == '/') {
          if (currentElementAfterDecimal > 0) {
            currentCalculationResult = currentCalculationResult / parseFloat((currentElementBeforeDecimal + '.' + currentElementAfterDecimal));
          }
          else {
            currentCalculationResult = currentCalculationResult / parseInt(currentElementBeforeDecimal);
          }
        }


        setResultHolder(currentCalculationResult);
        setCurrentStringArrayHolder([]);

      }
    }
  };


  const handleDeleteButton = () => {
    let arrr = [...currentStringArrayHolder];
    arrr = arrr.slice(0, -1);
    setCurrentStringArrayHolder(arrr);
  };
  const handleClearButton = () => {
    setCurrentStringArrayHolder([])
    setResultHolder(null);

  };


  return (
    <View style={styles.mainView}>
      <Text style={styles.inputStyleLight}>{resultHolder == null ? currentStringArrayHolder.length == 0 ? '0' : currentStringArrayHolder.join('') : resultHolder}</Text>
      {/* <TextInput
        value={resultHolder}
        //   value={resultHolder == null ? currentStringArrayHolder.length == 0 ? '0' : currentStringArrayHolder.join('') : }
        style={
          themeState?.activeTheme === 'light'
            ? styles.inputStyleLight
            : styles.inputStyle
        }
        editable={false}
        placeholderTextColor={
          themeState?.activeTheme === 'light' ? '#000' : '#fff'
        }
        multiline={true}
      /> */}
      <View style={styles.inputKeyBox}>
        <TouchableOpacity
          style={themeState?.activeTheme === 'light' ? styles.inputKeyFullLight : styles.inputKeyFull}
          onPress={() => handleClearButton()}
        >
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleDeleteButton()}>
          <Image
            source={
              themeState?.activeTheme === 'light' ? DeleteDark : DeleteWhite
            }
            style={styles.backspace}
          />
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('/')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>/</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputKeyBox}>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('1')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('2')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('3')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('*')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>*</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputKeyBox}>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('4')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('5')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('6')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('-')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>-</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputKeyBox}>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('7')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('8')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('9')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('+')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputKeyBox}>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('.')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={themeState?.activeTheme === 'light' ? styles.inputKeyLight : styles.inputKey} onPress={() => handleInput('0')}>
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={themeState?.activeTheme === 'light' ? styles.inputKeyFullLight : styles.inputKeyFull}
          onPress={() => calculateResult()}
        >
          <Text style={themeState?.activeTheme === 'light' ? styles.inputKeyItemLight : styles.inputKeyItem}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    // backgroundColor: 'red',
    paddingBottom: 20,
  },
  inputStyle: {
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 10,
    color: '#fff',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 16,
  },
  inputStyleLight: {
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 10,
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 16,
  },
  inputKeyBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  inputKeyFull: {
    backgroundColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    height: 55,
    width: '47%',
  },
  inputKeyFullLight: {
    backgroundColor: 'rgba(129,129,165,.15)',
    borderRadius: 5,
    justifyContent: 'center',
    height: 55,
    width: '47%',
  },
  inputKey: {
    backgroundColor: '#000',
    borderRadius: 5,
    width: '20%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputKeyLight: {
    backgroundColor: 'rgba(129,129,165,.15)',
    borderRadius: 5,
    width: '20%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputKeyItem: {
    fontSize: 24,
    color: '#EAEAEA',
    textAlign: 'center',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
  },
  inputKeyItemLight: {
    fontSize: 24,
    color: '#1a1a1a',
    textAlign: 'center',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
  },
  backspace: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
