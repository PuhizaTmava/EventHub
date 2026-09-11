// firebase/config.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBgK9onNcVTHzTRbBh9UQRJURe3r_E-nec",
  authDomain: "eventhub-b51e7.firebaseapp.com",
  projectId: "eventhub-b51e7",
  storageBucket: "eventhub-b51e7.firebasestorage.app",
  messagingSenderId: "974753081458",
  appId: "1:974753081458:web:61b03623074b7e99e47aeb",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
