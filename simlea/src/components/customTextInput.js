/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
// import {TextInput} from 'react-native-paper';

export default function CustomTextInput(props) {
  return (
    <View>
      <TextInput
        mode="outlined"
        right={props?.right}
        label={props?.label}
        textAlign="center"
        style={props.style}
        placeholder={props?.placeholder}
        placeholderTextColor="#808080"
        outlineColor="##EAEAEA"
        value={props?.value}
        onChangeText={props.onChangeText}
        keyboardType={props?.keyboardType}
        secureTextEntry={props?.secureTextEntry}
      />
    </View>
  );
}
