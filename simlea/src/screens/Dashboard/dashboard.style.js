/* eslint-disable prettier/prettier */
import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: '#262626',
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#EAEAEA',
    flex: 1,
  },
  flatGridStyle: {
    marginLeft: Platform.isPad === true ? 50 : 15,
    marginRight: Platform.isPad === true ? 52 : 15,
    marginTop: Platform.isPad === true ? 30 : 20,
  },
  addIcon: {
    width: 38,
    height: 38,
    marginRight: 0,
    marginBottom: 12,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E0E0',
    opacity: 0.8,
    zIndex: 1,
  },
});
