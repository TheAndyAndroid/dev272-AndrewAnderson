import { createContext, useContext, useState, type ReactNode } from "react";

type CompletedWorkout = {
    workoutid: string;
    completedDate: string;
};

type WorkoutContextType = {
    completedWorkouts: CompletedWorkout[];
    markWorkoutCompleted: (workoutid: string) => void;
    isWorkoutCompleted: (workoutid: string) => boolean;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children, }: {children: ReactNode}) {
    const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);

    function markWorkoutCompleted(workoutid: string) {setCompletedWorkouts((current) => {
        if (
            current.some(
                (workout) => workout.workoutid === workoutid
            )
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
        return completedWorkouts.some((workout) => workout.workoutid === workoutid);
        }

    return (
        <WorkoutContext.Provider value={{ completedWorkouts, markWorkoutCompleted, isWorkoutCompleted }}>
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