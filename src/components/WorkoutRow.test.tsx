import type { WorkoutRow as Workout } from "@/api/workouts";
import { useLocalSearchParams } from "expo-router";
import { fireEvent, renderRouter } from "expo-router/testing-library";
import { Text } from "react-native";
import WorkoutRow from "./WorkoutRow";

const testWorkout: Workout = {
  id: "test-Workout1",
  created_at: "2026-11-02T17:10:38Z",
  exercise: "Run",
  duration: 36,
  distance: 4.47,
  distance_unit: "km",
  sets: null,
  reps: null,
  date: "11/02/26",
  notes: "This is a Test",
  completed: false,
};

function DetailTestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>Workout ID: {id}</Text>;
}

describe("WorkoutRow", () => {
  test("displays the workout details", async () => {
    const { findByText } = await renderRouter({
      index: () => <WorkoutRow workout={testWorkout} />,
      "workouts/[id]": DetailTestScreen,
    });
    expect(findByText("Run")).toBeTruthy();
    expect(findByText("36 Minutes")).toBeTruthy();
    expect(findByText("11/02/26")).toBeTruthy();
  });

  test("opens the workout details route with the correct ID", async () => {
    const { findByText } = await renderRouter({
      index: () => <WorkoutRow workout={testWorkout} />,
      "workouts/[id]": DetailTestScreen,
    });
    await fireEvent.press(await findByText("Run"));
    expect(await findByText("Workout ID: test-Workout1")).toBeTruthy();
  });
});
