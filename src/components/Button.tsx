import React from 'react';
import colors from '@/utils/colors';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  primary?: boolean;
}

export default function Button({
  disabled,
  primary,
  text,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        styles.submitButton,
        primary ? styles.primaryButton : {},
        disabled ? styles.disabledButton : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          primary ? { color: colors.white } : {},
          disabled ? { color: colors.disabled } : {},
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.headerText, textAlign: 'center' },
  submitButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
    borderRadius: 40,
    shadowColor: 'rgba(0,0,0,.25)',
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  primaryButton: {
    backgroundColor: colors.blue,
  },
});
