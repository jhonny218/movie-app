import { testAppwriteConnection } from "@/services/appwrite";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from 'react-native';
import './global.css';

export default function RootLayout() {
  useEffect(() => {
    // Test Appwrite connection on app startup
    testAppwriteConnection();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name="movie/[id]"
          options={{ headerShown: false }}
          />
      </Stack>
    </>
  );
}
