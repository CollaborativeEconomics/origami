import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
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
      {unsafe ? (
        children
      ) : (
        <SafeAreaView style={styles.safeView}>{children}</SafeAreaView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  safeView: { flex: 1 },
});

export default PageWrapper;
