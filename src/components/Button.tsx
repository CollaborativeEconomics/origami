import React, { useMemo } from 'react';
import colors from '@/utils/colors';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  icon?: (typeof MaterialIcons)['defaultProps']['name'];
  primary?: boolean;
}

export default function Button({
  disabled,
  primary,
  text,
  icon,
  ...props
}: ButtonProps) {
  const textStyle = useMemo(
    () => [
      styles.text,
      primary ? { color: colors.white } : {},
      disabled ? { color: colors.disabledText } : {},
    ],
    [primary, disabled],
  );

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
      {icon ? (
        <MaterialIcons
          name={icon}
          style={[textStyle, { fontSize: 22, marginRight: 10 }]}
        />
      ) : (
        ''
      )}
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.headerText, fontSize: 15 },
  submitButton: {
    flex: 1,
    maxHeight: 60,
    backgroundColor: colors.background,
    paddingVertical: 20,
    borderRadius: 40,
    shadowColor: 'rgba(0,0,0,.25)',
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  primaryButton: {
    backgroundColor: colors.blue,
  },
});
