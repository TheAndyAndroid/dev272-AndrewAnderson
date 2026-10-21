import { workouts as initialWorkouts, type Workout } from "@/data/workouts";
import { createContext, useContext, useState, type ReactNode } from "react";

type CompletedWorkout = {
    workoutid: string;
    completedDate: string;
};

type WorkoutContextType = {
    workouts: Workout[];
    addWorkout: (workout: Workout) => void;
    completedWorkouts: CompletedWorkout[];
    markWorkoutCompleted: (workoutid: string) => void;
    isWorkoutCompleted: (workoutid: string) => boolean;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children, }: {children: ReactNode}) {
    const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
    const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);

    function addWorkout(workout: Workout) {
        setWorkouts((current) => [workout, ...current]);
    }

    function markWorkoutCompleted(workoutid: string) {
        setWorkouts((current) => current.map((workout) => workout.id === workoutid ?  { ...workout, completed: true } : workout));
        setCompletedWorkouts((current) => {
            if (
                current.some((workout) => workout.workoutid === workoutid)
            )   {
                return current;
                }

            return [
                ...current,
                {
                    workoutid, completedDate: new Date().toLocaleDateString(),
                },
            ];
        });
    }

    function isWorkoutCompleted(workoutid: string) {
        return workouts.some((workout) => workout.id === workoutid && workout.completed);
        }

    return (
        <WorkoutContext.Provider value={{ workouts, addWorkout, completedWorkouts, markWorkoutCompleted, isWorkoutCompleted }}>
            {children}
        </WorkoutContext.Provider>
    )
};

export function useWorkout() {
    const context = useContext(WorkoutContext);

    if (!context) {
        throw new Error(
            "useWorkout must be used inside WorkoutProvider"
        );
    }
    return context;
};