import React from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {Text} from 'react-native-paper';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';
import {decode as atob} from 'base-64';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NAVIGATION} from '../../../constants';

export default function EventListItem(props) {
  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  };

  // let imageUri = 'data:image/svg;base64,' + b64toBlob(props?.item?.logo?.data);
  // const DATA_IMAGE = atob(props?.item?.logo?.data);
  //console.log('page3333', props.item);
  return (
    <TouchableOpacity
      style={[styles.eventContainer]}
      onPress={() => props.onPress(props.item.id)}>
      <View
        style={[
          props.theme.activeTheme === 'light'
            ? styles.imageBoxLight
            : styles.imageBox,
        ]}>
        {props?.item?.logo?.extension === 'svg' ? (
          <Image
            style={styles.cardIcon}
            source={{
              uri: `data:image/svg+xml;base64,${props?.item?.logo?.data}`,
            }}
          />
        ) : (
          <>
            <FastImage
              style={styles.cardIcon}
              source={{
                uri: `data:image/props?.item?.logo?.extension;base64,${props?.item?.logo?.data}`,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </>
        )}
        <Text
          style={
            props.theme.activeTheme === 'light'
              ? styles.textItemLight
              : styles.textItem
          }>
          {props?.item?.name}
        </Text>
      </View>
      {/* <View
        style={[
          styles.imageBox,
          props.theme.activeTheme === 'light'
            ? GlobalStyle.darkTheme
            : GlobalStyle.lightTheme,
        ]}>
        {props?.item?.logo?.extension === 'svg' ? (
          <Image
            style={[styles.cardIcon, {backgroundColor: '#FF0000'}]}
            source={{
              uri: `data:image/svg+xml;base64,${DATA_IMAGE}`,
            }}
          />
        ) : (
          <>
            <Image
              style={styles.cardIcon}
              source={{
                uri: `${
                  Platform.OS === 'ios'
                    ? props?.item?.logo?.data
                    : `file://${props?.item?.logo?.data}`
                }`,
              }}
            />
          </>
        )}
        <Text style={styles.textItem}>{props.item.name}</Text>
      </View> */}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  eventContainer: {
    width: '91%',
    marginLeft: Platform.OS === 'ios' ? 19 : 16,
  },
  imageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#4B4D54',
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 22 : 18,
    borderRadius: 4,
  },
  imageBoxLight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: '#EAEAEA',
    marginTop: Platform.OS === 'ios' ? 22 : 18,
    borderRadius: 4,
  },
  cardIcon: {
    height: Platform.isPad === true ? 41 : 31,
    width: Platform.isPad === true ? 40 : 30,
    marginLeft: Platform.OS === 'ios' ? 9 : 7,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  textItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#EAEAEA',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 19 : 13,
  },
  textItemLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#1a1a1a',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 19 : 13,
  },
});

