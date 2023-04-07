import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import KeyRight from '../../../assets/images/Right.png';
import LOgo from '../../../assets/images/hyundai.png';
import GlobalStyle from '../../../style/globalstyle';

export default function Logo(props) {
  return (
    <TouchableOpacity
      style={[
        styles.logo,
        props.theme.activeTheme === 'light'
          ? GlobalStyle.darkTheme
          : GlobalStyle.lightTheme,
      ]}>
      <View style={styles.textGroup}>
        <Text
          style={[
            styles.logoText,
            props.theme.activeTheme === 'light'
              ? GlobalStyle.darkTheme
              : GlobalStyle.lightTheme,
          ]}>
          IAA MOBILITY 2023
        </Text>
        <Image
          source={LOgo}
          style={[
            props.theme.activeTheme === 'light'
              ? styles.imageLogoDark
              : styles.imageLogoLight
          ]}
        />
      </View>
      <View style={[styles.eventLogoBtn]}>
        <Image source={KeyRight} style={styles.logoRightIcon} />
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'space-between',
    marginBottom: 50,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  textGroup: {
    width: '70%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 25,
  },
  logoText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 12,
    color: '#000000',
  },
  imageLogoDark: {
    height: 19,
    width: 79,
    backgroundColor: '#fff'
  },
  imageLogoLight: {
    height: 19,
    width: 79,
  },
  eventLogoBtn: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#30C6EA',
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
  },
  logoRightIcon: {
    width: 12,
    height: 20,
  },
});
