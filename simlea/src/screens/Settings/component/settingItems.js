import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Switch} from 'react-native-paper';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';

export default function SettingItems(props) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingBox}>
        <Text
          style={[
            styles.textSetting,
            props.theme.activeTheme === 'light'
              ? GlobalStyle.lightTheme
              : GlobalStyle.darkTheme,
          ]}>
          {props.item.title}
        </Text>
        <Switch
          value={isSwitchOn}
          color={isSwitchOn ? '#30C6EA' : 'transparent'}
          onValueChange={onToggleSwitch}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  settingContainer: {
    paddingHorizontal: 15,
  },
  settingBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#4B4D54',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },

  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
  },
  textSetting: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#EAEAEA',
    marginLeft: 5,
    alignItems: 'flex-start',
  },
});
