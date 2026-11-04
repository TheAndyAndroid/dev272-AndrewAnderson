import type { WorkoutRow } from "@/api/workouts";
import { fetchAllWorkouts } from "@/api/workouts";
import Index from "@/app/(tabs)/index";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

jest.mock("@/api/workouts", () => ({
  fetchAllWorkouts: jest.fn(),
}));

const mockedFetchWorkouts = jest.mocked(fetchAllWorkouts);

const mockWorkouts: WorkoutRow[] = [
  {
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
  },
  {
    id: "test-Workout2",
    created_at: "2026-11-04T19:30:15Z",
    exercise: "Weight Lifting",
    duration: 63,
    distance: null,
    distance_unit: "mi",
    sets: 8,
    reps: 20,
    date: "11/04/26",
    notes: "This is another Test",
    completed: false,
  },
];

async function renderHomeScreen() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <WorkoutProvider>
        <Index />
      </WorkoutProvider>
    </QueryClientProvider>,
  );
}

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  test("displays the mocked workouts", async () => {
    mockedFetchWorkouts.mockResolvedValue(mockWorkouts);
    await renderHomeScreen();
    expect(await screen.findByText("Run")).toBeTruthy();
    expect(screen.getByText("Weight Lifting")).toBeTruthy();
  });

  test("filters workouts when the user searches", async () => {
    mockedFetchWorkouts.mockResolvedValue(mockWorkouts);
    await renderHomeScreen();
    const searchInput = await screen.findByPlaceholderText(
      "Search Workouts By Name Or Date...",
    );
    fireEvent.changeText(searchInput, "Run");
    expect(screen.queryByText("Run")).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByText("Weight Lifting")).toBeNull();
    });
  });

  test("displays an error message when fetching workouts fails", async () => {
    mockedFetchWorkouts.mockRejectedValueOnce(
      new Error("Unable to fetch workouts"),
    );
    await renderHomeScreen();
    await waitFor(() => {
      expect(mockedFetchWorkouts).toHaveBeenCalled();
    });
    expect(await screen.findByText("Could Not Load Workouts!")).toBeTruthy();
    expect(
      screen.getByText("Please Check Internet Connection and Try Again!"),
    ).toBeTruthy();
  });

  test("retries fetching workouts when Try Again is pressed", async () => {
    mockedFetchWorkouts
      .mockRejectedValueOnce(new Error("Unable to fetch workouts"))
      .mockResolvedValueOnce(mockWorkouts);
    await renderHomeScreen();
    const retryButton = await screen.findByText("Try Again!");
    fireEvent.press(retryButton);
    expect(await screen.findByText("Weight Lifting")).toBeTruthy();
    await waitFor(() => {
      expect(mockedFetchWorkouts).toHaveBeenCalledTimes(2);
    });
  });
});
