import { WorkoutProvider } from "@/context/WorkoutContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        <Stack.Screen name="workouts/[id]" options={{ title: "Workout" }} />
        <Stack.Screen name="add" options={{ title: "Add Workout" }} />
    </Stack>
    </WorkoutProvider>
  );
};