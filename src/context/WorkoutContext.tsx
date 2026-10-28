import { loadJson, saveJson } from "@/lib/storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type SortOrder = "newest" | "oldest";

type WorkoutContextType = {
    sortOrder: "newest" | "oldest";
    setSortOrder: (order: SortOrder) => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children, }: {children: ReactNode}) {
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        async function loadSortOrder() {
            const savedOrder =  await loadJson<"newest" | "oldest">(
                "workout-sort-order", "newest"
            );
            setSortOrder(savedOrder);
            setHydrated(true);
        }
        loadSortOrder();
    }, []);

    useEffect(() => {
        if (hydrated) {
            saveJson("workout-sort-order", sortOrder);
        }
    }, [sortOrder, hydrated]);

    return (
        <WorkoutContext.Provider value={{ sortOrder, setSortOrder }}>
            { children }
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error(
            "useWorkout must be used inside WorkoutProvider"
        );
    }
    return context;
}