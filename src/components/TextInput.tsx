import colors from '@/utils/colors';
import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from 'react-native';

export default function TextInput(props: TextInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Label</Text>
      <RNTextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  input: {
    height: 60,
    backgroundColor: colors.lighter,
    paddingHorizontal: 20,
    borderRadius: 17,
  },
});
