import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: Platform.select({
          ios: "#8E8E93",
          android: "#888888",
        }),
        tabBarStyle: {
          borderTopColor: Platform.select({
            ios: "#C6C6C8",
            android: "#E0E0E0",
          }),
        },
        headerShown: true,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Global News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
          tabBarLabel: "News",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
          tabBarLabel: "Saved",
        }}
      />
    </Tabs>
  );
}
