import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CustomButton from './CustomButton';
import GlobalStyle from '../style/globalstyle';

export default function Language(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Form language</Text>
      <View style={styles.buttonGrp}>
        <CustomButton
          title="Deutsche"
          onPress={() => props.onPressDeutsche()}
          style={styles.formBtn}
          labelStyle={styles.buttonTitle}
        />
        <CustomButton
          title="English"
          onPress={() => props.onPressEnglish()}
          style={styles.formBtn}
          labelStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  buttonGrp: {
    backgroundColor: '#262626',
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'space-evenly',
    marginRight: 38,
  },
  headText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 12,
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 10,
  },
  formBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 3,
    paddingHorizontal: 15,
  },
  buttonTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 10,
  },
});
