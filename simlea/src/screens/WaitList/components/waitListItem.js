import React from 'react';
import {Image, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';

export default function WaitListItem(props) {
  return (
    <View>
      <TouchableOpacity style={styles.contentContainer}>
        <View style={{flexDirection: 'column', marginTop: 10}}>
          <Text style={styles.textItem}>{props?.item?.dateModified}</Text>
          <Text style={styles.subtextItem}>
            {props.item.leadid}
            {','}
            {props.item.appUser}
          </Text>
          <Text style={styles.subtextItem}>{props.item.name}</Text>
        </View>
        <Image
          source={require('../../../assets/images/globe.png')}
          style={styles.globeIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#30C6EA',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
  },
  globeIcon: {
    height: 28,
    width: 28,
  },
  textItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 16,
    color: '#EAEAEA',
  },
  subtextItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 16,
    color: '#EAEAEA',
  },
});
