import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { ToastProvider } from '../src/context/ToastContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ProductProvider } from '../src/context/ProductContext';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { Animated, View } from 'react-native';
import WelcomeScreen from '../src/common/WelcomeScreen'; // Ensure this path is correct

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    onPrimaryContainer: '#2196F3',
    outline: '#2196F3',
  },
};

const preloadAssets = async () => {
  const assets = [
    require('../assets/logo/react-logo.png'),
    // Add more assets here as needed
  ];

  try {
    const cacheAssets = assets.map((asset) => Asset.fromModule(asset).downloadAsync());
    await Promise.all(cacheAssets);
  } catch (error) {
    console.error('Error preloading assests:', error);
  }
};

const AppContent = () => {
  const db = useSQLiteContext();
  const [isAppReady, setIsAppReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const opacity = new Animated.Value(10); // For fade-in animation

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            category TEXT,
            discount INTEGER,
            measurementType TEXT,
            subProductCategory TEXT
          );
        `);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    const initializeApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Promise.all([initializeDatabase(), preloadAssets()]);
        setIsAppReady(true);
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [db]);

  // Trigger fade-in animation after the welcome screen
  useEffect(() => {
    if (!showWelcome) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }
  }, [showWelcome]);

  const handleAnimationEnd = () => {
    setShowWelcome(false);
  };

  if (!isAppReady) {
    return null; // Prevent rendering until assets and DB are ready
  }

  if (showWelcome) {
    return <WelcomeScreen onAnimationEnd={handleAnimationEnd} />;
  }

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <Stack screenOptions={{ headerShown: false }} />
    </Animated.View>
  );
};


export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <ThemeProvider>
        <ToastProvider>
          <SQLiteProvider databaseName="billing.db">
            <ProductProvider>
              <StatusBar style="light" backgroundColor="#000" translucent={false} />
              <AppContent />
            </ProductProvider>
          </SQLiteProvider>
        </ToastProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
