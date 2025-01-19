import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const WelcomeScreen = ({ onAnimationEnd }) => {
  const scale = new Animated.Value(1); // Initial scale value

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2, // Scale up
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // Scale down
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    // Set timeout to proceed after 3 seconds
    const timeout = setTimeout(() => {
      animation.stop();
      onAnimationEnd();
    }, 3000);

    return () => {
      animation.stop();
      clearTimeout(timeout);
    };
  }, [onAnimationEnd, scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circleContainer,
          { transform: [{ scale }] }, // Apply scale animation
        ]}
      >
        <View style={styles.outerCircle} />
        <View style={styles.innerCircle}>
          <Image
            source={require('../../assets/logo/SMWelcomeLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth:4,
    borderColor: 'black',
    backgroundColor: 'black', // Semi-transparent white
  },
  innerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth:4,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default WelcomeScreen;
