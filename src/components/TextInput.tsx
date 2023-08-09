import colors from '@/utils/colors';
import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from 'react-native';
import { MaterialIcons as Icons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  label: string;
  icons: Array<{
    icon?: (typeof Icons)['defaultProps']['name'];
    onIconPress?: () => void;
  }>;
}

export default function TextInput({ label, icons = [], ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ justifyContent: 'center' }}>
        <RNTextInput style={styles.input} {...props} />
        <View style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
          {icons.map(({ icon, onIconPress }) => (
            <Icons
              style={{
                color: colors.text,
                marginLeft: 10,
              }}
              name={icon}
              size={24}
              onPress={onIconPress}
            />
          ))}
        </View>
      </View>
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
