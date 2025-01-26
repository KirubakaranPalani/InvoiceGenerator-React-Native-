import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const WelcomeScreen = ({ onAnimationEnd }) => {
  const backgroundColor = new Animated.Value(0); // Initial value for background color interpolation

  useEffect(() => {
    // Background color animation (white <-> pale blue)
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColor, {
          toValue: 1, // Transition to pale blue
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0, // Transition back to white
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    // Stop animation after 3 seconds
    const timeout = setTimeout(() => {
      animation.stop();
      onAnimationEnd();
    }, 1000);

    return () => {
      animation.stop();
      clearTimeout(timeout);
    };
  }, [onAnimationEnd]);

  // Interpolate background color between white and pale blue
  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#e0f7fa'], // White to pale blue
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedBackgroundColor }]}>
      <Image
        source={require('../../assets/logo/react-logo.png')} // Adjust your path here
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150, // Adjust size of the logo
    height: 150,
  },
});

export default WelcomeScreen;
