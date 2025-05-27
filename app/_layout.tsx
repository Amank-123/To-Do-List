// app/_layout.js or app/_layout.tsx
import { HeaderTitle } from "@react-navigation/elements";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgb(164, 220, 220)", // Light blue
        },
        headerTintColor: "rgb(72, 139, 139)", // Icon & text color
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 16,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "To-Do" }} />
      <Stack.Screen name="SubTask" options={{ title: "Sub-Task" }} />
      <Stack.Screen name="taskDetail" options={{ title: "Detail" }} />
    </Stack>
  );
}
