import { WorkoutProvider } from "@/context/WorkoutContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkoutProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
          <Stack.Screen name="workouts/[id]" options={{ title: "Workout" }} />
          <Stack.Screen name="add" options={{ title: "Add Workout" }} />
        </Stack>
      </WorkoutProvider>
    </QueryClientProvider> 
  );
};