/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {Text} from 'react-native-paper';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';
import ICON_ALERT from '../../../assets/images/alert.png';
import {TimeComponent} from '../../../components';

export default function DashboardItem(props) {
  // console.log('DashboardItem');
  //console.log('props.itemyyyyyy', props.item);
  // console.log(props.item.type);
  return (
    <View style={styles.imageCard}>
      <TouchableOpacity
        style={
          props.theme.activeTheme === 'light'
            ? [styles.imageBoxLight]
            : [styles.imageBoxDark]
        }
        onPress={() => props.onPress()}>
        {!props.item.production ? (
          <View
            style={
              props.theme.activeTheme === 'light'
                ? styles.alertBoxLight
                : styles.alertBoxDark
            }>
            <Image source={ICON_ALERT} style={styles.alertIcon} />
            <Text style={styles.alertText}>Test mode</Text>
          </View>
        ) : (
          <View
            style={
              props.theme.activeTheme === 'light'
                ? styles.blankBoxLight
                : styles.blankBoxDark
            }
          />
        )}
        {props.item.type === 'New Record' ? (
          <>
            {props.theme.activeTheme === 'light' ? (
              <Image
                source={require('../../../assets/images/add-record-light.png')}
                style={styles.addRecordIcon}
              />
            ) : (
              <Image
                source={require('../../../assets/images/add-record.png')}
                style={styles.addRecordIcon}
              />
            )}
          </>
        ) : (
          <>
            {props.theme.activeTheme === 'light' ? (
              <Image
                source={require('../../../assets/images/list-record-light.png')}
                style={styles.addRecordIcon}
              />
            ) : (
              <Image
                source={require('../../../assets/images/list-record.png')}
                style={styles.addRecordIcon}
              />
            )}
          </>
        )}
        {Platform.isPad === true ? (
          <>
            <Text
              style={
                props.theme.activeTheme === 'light'
                  ? styles.textItemDark
                  : styles.textItemLight
              }>
              {props.item.type} {props.item.name}
            </Text>
          </>
        ) : (
          <>
            <Text
              style={
                props.theme.activeTheme === 'light'
                  ? styles.textItemDark
                  : styles.textItemLight
              }>
              {props.item.type}
            </Text>
            <Text
              style={
                props.theme.activeTheme === 'light'
                  ? styles.textItemDark
                  : styles.textItemLight
              }>
              {props.item.name}
            </Text>
          </>
        )}
        <View style={styles.versionView}>
          <Text style={styles.textItem}>v{props.item.version}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  imageCard: {
    borderRadius: Platform.isPad === true ? 5 : 4,
    marginBottom: Platform.isPad === true ? 0 : 3,
  },
  imageBoxDark: {
    backgroundColor: '#1A1A1A',
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBoxLight: {
    backgroundColor: 'rgba(129,129,165,.15)',
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBoxLight: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: Platform.isPad === true ? '100%' : '50%',
    marginRight: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  alertBoxDark: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    width: Platform.isPad === true ? '100%' : '50%',
    marginRight: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  blankBoxLight: {
    width: Platform.isPad === true ? '100%' : '50%',
    marginRight: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  blankBoxDark: {
    width: Platform.isPad === true ? '100%' : '50%',
    marginRight: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  alertIcon: {
    height: 19,
    width: 21,
    marginLeft: 2,
  },
  alertText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 12 : 10,
    color: '#F23636',
  },
  addRecordIcon: {
    height: 29,
    width: 29,
    marginTop: 21,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  listViewIcon: {
    height: 29,
    width: 35,
    marginTop: 21,
    marginBottom: 6,
  },
  textItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#EAEAEA',
    lineHeight: 14,
    alignItems: 'center',
  },
  textItemLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#EAEAEA',
    lineHeight: 14,
    alignItems: 'center',
  },
  textItemDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#1a1a1a',
    lineHeight: 14,
    alignItems: 'center',
  },
  versionView: {
    borderRadius: 6,
    marginTop: 18,
    marginBottom: 17,
    alignItems: 'center',
    width: '25%',
    paddingTop: 1,
    backgroundColor: '#30C6EA',
  },
  versionText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 10,
    color: '#EAEAEA',
    alignItems: 'center',
  },
});
