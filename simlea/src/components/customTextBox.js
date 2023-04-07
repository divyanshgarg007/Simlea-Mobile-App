import React from 'react';
import {TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';

export default function CustomTextBox(props) {
  return (
    <View>
      <TextInput
        style={props.style}
        value={props.value}
        placeholderTextColor={props.placeholderTextColor}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
}
