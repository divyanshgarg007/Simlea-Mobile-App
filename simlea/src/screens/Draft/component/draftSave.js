import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as formAction from '../../../redux/action/formAction';
import GlobalStyle from '../../../style/globalstyle';
import { NAVIGATION } from '../../../constants/navigation';

import moment from 'moment';
export default function DraftSave(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [draftFormData, setDraftFormData] = useState(props.data);
  const dispatch = useDispatch();
  console.log(props.item);
  console.log(props.item.timestamp);
  console.log(moment(props.item.timestamp).format('dddd,DD-MM-YYYY'));
  return (
    <View
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={styles.contentContainer}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.textItem}>{Date()}</Text>
          <Text style={styles.subtextItem}>{props.item.lead_id}</Text>
          <Text style={styles.subtextItem}>{moment(props.item.timestamp).format('dddd,DD-MM-YYYY')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
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