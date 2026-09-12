import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts as usePlusJakarta,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts as useDMMono, DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { colors } from './utils/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [jakartaLoaded] = usePlusJakarta({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const [monoLoaded] = useDMMono({ DMMono_400Regular, DMMono_500Medium });

  const fontsLoaded = jakartaLoaded && monoLoaded;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </AuthProvider>
    </View>
  );
}
