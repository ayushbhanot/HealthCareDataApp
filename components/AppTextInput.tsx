import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';


const AppTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      placeholderTextColor="#ffffff66"
      style={[styles.input, props.style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: '#fe7c3f',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#ffffff',
  },
});

export default AppTextInput;
