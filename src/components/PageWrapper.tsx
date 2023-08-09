import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/utils/colors';

const PageWrapper = ({
  children,
  style,
  unsafe,
  ...props
}: PropsWithChildren<ViewProps & { unsafe?: boolean }>) => {
  return (
    <ScrollView contentContainerStyle={[styles.container, style]} {...props}>
      <LinearGradient
        // Background Linear Gradient
        colors={[colors.white, colors.backgroundDarker]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {unsafe ? (
          children
        ) : (
          <SafeAreaView style={styles.safeView}>{children}</SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  safeView: { flex: 1 },
});

export default PageWrapper;
