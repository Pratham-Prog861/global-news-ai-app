import ErrorBoundary from "@/src/components/ErrorBoundary";
import { Stack } from "expo-router";
import { Platform, PlatformColor } from "react-native";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            color: (Platform.OS === "ios"
              ? PlatformColor("label")
              : "#000000") as any,
          },
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="news/[id]"
          options={{
            title: "",
            headerTransparent: true,
            headerBlurEffect: "regular",
          }}
        />
        <Stack.Screen
          name="summary"
          options={{
            title: "AI Summary",
            presentation: "modal",
            headerLargeTitle: false,
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
