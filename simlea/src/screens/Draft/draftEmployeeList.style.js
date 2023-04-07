import {StyleSheet} from 'react-native';
import GlobalStyle from '../../style/globalstyle';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '31%',
  },
  saveButton: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: 35,
  },
  cancelButton: {
    borderRadius: 4,
    backgroundColor: '#4B4D54',
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
  activeDraftEmployee: {
    backgroundColor: '#30C6EA',
  },
});
