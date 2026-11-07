import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Shared AsyncStorage adapter for zustand persist. */
export const asyncStorage = createJSONStorage(() => AsyncStorage);
