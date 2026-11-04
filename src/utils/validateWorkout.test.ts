import { WorkoutFormValues, workoutSchema } from "./validateWorkout";

const valid: WorkoutFormValues = {
  exercise: "Run",
  duration: "55",
  distance: "2.67",
  distanceUnit: "mi",
  sets: "",
  reps: "",
  date: "9/04/26",
  notes: "Morning Run",
  completed: false,
};

function errorFor(values: WorkoutFormValues, field: keyof WorkoutFormValues) {
  const result = workoutSchema.safeParse(values);
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("workoutSchema", () => {
  test("requires an exercise", () => {
    const values = { ...valid, exercise: "" };
    const message = errorFor(values, "exercise");
    expect(message).toBe("*Please Select An Exercise!");
    expect(errorFor(values, "duration")).toBeUndefined();
  });

  test("requires a valid exercise", () => {
    expect(errorFor({ ...valid, exercise: "Swimming" }, "exercise")).toBe(
      "Please Select A Valid Exercise!",
    );
  });

  test("requires a positive whole number for duration", () => {
    expect(errorFor({ ...valid, duration: "0" }, "duration")).toBe(
      "*Please Enter A Positive Whole Number!",
    );
  });

  test("rejects a decimal duration", () => {
    expect(errorFor({ ...valid, duration: "10.5" }, "duration")).toBe(
      "*Please Enter A Positive Whole Number!",
    );
  });

  test("requires a valid date", () => {
    expect(errorFor({ ...valid, date: "2/30/26" }, "date")).toBe(
      "*Enter A Valid Date! (Ex: 10/05/26)",
    );
  });

  test("requires a distance for cardio workouts", () => {
    expect(errorFor({ ...valid, distance: "" }, "distance")).toBe(
      "*Distance Is Required!",
    );
  });

  test("requires a positive distance", () => {
    expect(errorFor({ ...valid, distance: "-2" }, "distance")).toBe(
      "*Please Enter A Positive Number for Distance!",
    );
  });

  test("accepts the minimum valid postive distance", () => {
    expect(
      errorFor({ ...valid, distance: "0.01" }, "distance"),
    ).toBeUndefined();
  });

  test("requires notes to be 250 characters or less", () => {
    expect(errorFor({ ...valid, notes: "a".repeat(251) }, "notes")).toBe(
      "*Notes Cannot Exceed 250 Character!",
    );
  });

  test("accepts notes at 250 character limit", () => {
    expect(
      errorFor({ ...valid, notes: "a".repeat(250) }, "notes"),
    ).toBeUndefined();
  });

  test("requires sets and reps for weightlifting workouts", () => {
    const values = {
      ...valid,
      exercise: "Weight Lifting",
      distance: "",
      sets: "",
      reps: "",
    };
    expect(errorFor(values, "sets")).toBe("*Sets Is Required!");
    expect(errorFor(values, "reps")).toBe("*Reps Is Required!");
  });

  test("requires positive whole numbers for sets and reps", () => {
    const values = {
      ...valid,
      exercise: "Weight Lifting",
      distance: "",
      sets: "0",
      reps: "5.5",
    };
    expect(errorFor(values, "sets")).toBe(
      "*Please Enter A Positive Whole Number For Sets",
    );
    expect(errorFor(values, "reps")).toBe(
      "*Please Enter A Positive Whole Number For Reps",
    );
  });

  test("accepts a valid workout form", () => {
    const values = valid;
    const result = workoutSchema.safeParse(values);
    expect(result.success).toBe(true);
  });
});
