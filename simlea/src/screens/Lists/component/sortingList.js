import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {CustomButton} from '../../../components';
import GlobalStyle from '../../../style/globalstyle';
import {Modal, Checkbox} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export function SortingList(props) {
  return (
    <Modal
      // dismissable={false}
      visible={props.visible}
      onDismiss={props.toggleOverlay}
      contentContainerStyle={styles.addEventContainer}>
      <ScrollView>
        <Text style={styles.addEventText}>Sorting</Text>
        {props.initialFormColumns.map((list, index) => (
          <SafeAreaView key={index} style={styles.checkMarkAndList}>
            <TouchableOpacity
              style={styles.textAndImage}
              onPress={() => [props.setSelectedKey(list)]}>
              <Text
                style={[
                  props.selectedKey == list
                    ? styles.sortTextActive
                    : styles.sortText,
                ]}>
                {list}
              </Text>
            </TouchableOpacity>
            {props.selectedKey == list && (
              <Image
                style={styles.checkIcon}
                source={require('../../../assets/images/tick.png')}
              />
            )}
          </SafeAreaView>
        ))}
        <View style={styles.addEventBtn}>
          <View style={styles.spaceBtns}>
            <CustomButton
              style={styles.confirmBtn}
              labelStyle={styles.actionTitle}
              title="Ascending"
              onPress={() => [
                props.handleAscendingSort(),
                props.toggleOverlay(),
              ]}
            />
          </View>
          <View style={styles.spaceBtns}>
            <CustomButton
              style={styles.confirmBtn}
              labelStyle={styles.actionTitle}
              title="Descending"
              onPress={() => [
                props.handleDescendingSort(),
                props.toggleOverlay(),
              ]}
              onAccessibilityActions="#808191"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    width: Platform.isPad === true ? '58%' : '80%',
    height: Platform.isPad === true ? '84%' : '88%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 17,
    paddingVertical: 23,
    zIndex: 1,
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 24 : 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#1A1A1A',
  },
  // checkbox: {
  //   marginBottom: 5,
  //   marginTop: 5,
  //   borderWidth: 2,
  //   borderColor: '#30C6EA',
  //   borderRadius: 4,
  // },
  checkMarkAndList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sortText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 16 : 12,
    textAlign: 'left',
    color: '#1A1A1A',
  },
  sortTextActive: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 12,
    textAlign: 'left',
    color: '#30C6EA',
  },
  textAndImage: {
    paddingVertical: 10,
  },
  addEventBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: Platform.isPad === true ? '40%' : '45%',
  },
  cancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 63 : 35,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 63 : 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 10,
    marginTop: Platform.isPad === true ? 18 : Platform.OS === 'ios' ? 10 : 15,
    lineHeight: Platform.isPad === true ? 21 : Platform.OS === 'ios' ? 0 : 15,
  },
  checkIcon: {
    height: Platform.isPad === true ? 16 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
  },
});
