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
  const assets = [require('../assets/logo/SmLogo.png')]; // Add other assets here if needed
  const cacheAssets = assets.map((asset) => Asset.fromModule(asset).downloadAsync());
  await Promise.all(cacheAssets);
};

const AppContent = () => {
  const db = useSQLiteContext();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS measurement_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
          );
        `);

        await db.execAsync(`
          INSERT OR IGNORE INTO measurement_types (name) VALUES 
          ('unit'),
          ('gram');
        `);

        await db.execAsync(`
          ALTER TABLE products ADD COLUMN measurementTypeId INTEGER;
        `);
      } catch (error) {
        if (!error.message.includes('duplicate column name')) {
          console.error('Error initializing database:', error);
        }
      }

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          quantity INTEGER,
          category TEXT,
          discount REAL,
          measurementTypeId INTEGER DEFAULT 1,
          FOREIGN KEY (measurementTypeId) REFERENCES measurement_types (id)
        );
      `);
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

  if (!isAppReady) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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
