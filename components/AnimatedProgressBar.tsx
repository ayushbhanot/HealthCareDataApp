import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface AnimatedProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function AnimatedProgressBar({ currentStep, totalSteps }: AnimatedProgressBarProps) {
  const progressAnim = React.useRef(new Animated.Value(0)).current; // starts at 0

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // width can't be animated with native driver
    }).start();
  }, [currentStep]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, totalSteps],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fe7c3f',
    borderRadius: 4,
  },
});
