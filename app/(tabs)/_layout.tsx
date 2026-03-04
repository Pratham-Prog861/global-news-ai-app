import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { PlatformColor } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: PlatformColor("secondaryLabel") as any,
        tabBarStyle: {
          borderTopColor: PlatformColor("separator") as any,
        },
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerBlurEffect: "none",
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
