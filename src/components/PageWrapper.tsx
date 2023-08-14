import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { Dimensions, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/utils/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PageWrapper = ({
  children,
  style,
  unsafe,
  ...props
}: PropsWithChildren<ViewProps & { unsafe?: boolean }>) => {
  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={[colors.white, colors.backgroundDarker]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.container, style]}
        {...props}
      >
        {unsafe ? (
          children
        ) : (
          <SafeAreaView style={styles.safeView}>{children}</SafeAreaView>
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height,
    justifyContent: 'space-between',
  },
  safeView: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
});

export default PageWrapper;
