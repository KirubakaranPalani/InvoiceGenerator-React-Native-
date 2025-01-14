import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { ToastProvider } from '../src/context/ToastContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ProductProvider } from '../src/context/ProductContext';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    onPrimaryContainer: '#2196F3',
    outline: '#2196F3',
  },
};
const AppContent = () => {
  const db = useSQLiteContext();
  const [isDbInitialized, setIsDbInitialized] = useState(false);

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

    const initialize = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initializeDatabase();
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    initialize();
  }, [db]);

  if (!isDbInitialized) {
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
