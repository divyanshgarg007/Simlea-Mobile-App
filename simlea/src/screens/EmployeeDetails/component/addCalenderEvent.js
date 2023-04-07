import React from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {CustomTextInput, CustomButton} from '../../../components';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';
import {Modal} from 'react-native-paper';
import moment from 'moment';

export function AddCalenderEvent(props) {
  const [text, setText] = React.useState({});
  const handleText = e => {
    setText({...text, e});
  };

  return (
    <Modal
      dismissable={false}
      visible={props.visible}
      onDismiss={props.toggleOverlay}
      contentContainerStyle={[
        styles.addEventContainer,
        props.theme.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <View style={styles.eventImageBox}>
        <Image
          source={require('../../../assets/images/events.png')}
          style={styles.eventImage}
        />
      </View>
      <Text style={styles.addEventTitleText}>Create Event</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Text style={styles.addEventText}>
          {moment.utc().local().format('YYYY-MM-DD HH:mm')}
        </Text>
        <Text style={styles.addEventText}>
          {moment.utc().local().add(0.5, 'hours').format('YYYY-MM-DD HH:mm')}
        </Text>
      </View>
      <CustomTextInput
        style={styles.addEventInput}
        placeholder="Enter Event Title"
        keyboardType="default"
        onChangeText={e => handleText(e)}
        // value={text}
        name="title"
      />
      <CustomTextInput
        style={styles.addEventInput}
        placeholder="Enter Notes"
        keyboardType="default"
        onChangeText={e => handleText(e)}
        // value={text}
        name="desc"
      />
      <View style={styles.addEventBtn}>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.cancelBtn}
            icon={require('../../../assets/images/cancel.png')}
            labelStyle={styles.actionTitle}
            title="Cancel"
            onPress={props.toggleOverlay}
          />
        </View>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.confirmBtn}
            icon={require('../../../assets/images/tick.png')}
            labelStyle={styles.actionTitle}
            title="Confirm"
            onPress={e => props.onPress(text)}
          />
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    width: Platform.isPad === true ? '60%' : '75%',
    backgroundColor: '#FBFBFB',
    borderRadius: Platform.isPad === true ? 10 : 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 24,
    zIndex: 10,
  },
  eventImageBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  eventImage: {
    height: 40,
    width: 35,
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addEventTitleText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addEventInput: {
    height: 33,
    width: '100%',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 5,
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
    flexBasis: '45%',
  },
  cancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    width: '100%',
    height: 35,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 10,
    lineHeight: Platform.OS === 'ios' ? 0 : 15,
  },
});
