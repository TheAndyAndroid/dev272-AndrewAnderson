import { supabase } from "@/lib/supabase";

export type WorkoutRow = {
    id: string;
    created_at: string;
    exercise: string;
    duration: number;
    date: string;
    notes: string;
    distance: number | null;
    distance_unit: "mi" | "km";
    sets: number | null;
    reps: number | null;
    completed: boolean;
}

export type NewWorkout = Omit<WorkoutRow, "id" | "created_at">;

export async function fetchAllWorkouts(): Promise<WorkoutRow[]> {
    const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("created_at", {ascending: false});
    if (error) throw error;
    return data;
}

export async function fetchWorkout(id: string): Promise<WorkoutRow | null> {
    const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
}

export async function createWorkout(workout: NewWorkout): Promise<WorkoutRow> {
    const { data, error } = await supabase
        .from("workouts")
        .insert(workout)
        .select()
        .single()
    if (error) throw error;
    return data;
}

export async function completeWorkout(id: string): Promise<WorkoutRow> {
    const { data, error } = await supabase
        .from("workouts")
        .update({ completed: true})
        .eq("id", id)
        .select()
        .single()
    if (error) throw error;
    return data;
}