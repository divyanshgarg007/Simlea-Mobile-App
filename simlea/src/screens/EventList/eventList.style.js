/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';
import {Platform} from 'react-native';
// import GlobalStyle from '../../style/globalstyle';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
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
    opacity: 0.7,
    zIndex: 1,
  },
  swipedRow: {
    width: '30%',
    backgroundColor: 'red',
    marginTop: 25,
    height: 78,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: Platform.OS === 'ios' ? 4 : 0,
  },
});
