import { z } from "zod";

export const workoutSchema = z.object ({

    exercise: z.string().trim().min(1, "*Please Select An Exercise!").refine((value) => [
        "Run", "Run (Treadmill)", "Walk", "Road Cycling", "Weight Lifting", "Other",
    ].includes(value), "Please Select A Valid Exercise!"),

    duration: z.string().trim().min(1, "*Duration Is Required!").refine((value) => 
    Number.isInteger(Number(value)) && Number(value) > 0, "*Please Enter A Positive Whole Number!"),

    distance: z.string(),

    distanceUnit: z.enum(["mi", "km"]),

    sets: z.string(),

    reps: z.string(),

    date: z.string().trim().min(1, "*Date Is Required!").refine((value) => {const parts = value.split("/");
        if (parts.length !== 3) return false;
        const month = Number(parts[0]); const day = Number(parts[1]); let year = Number(parts[2]);
        if (parts[0].length > 2 || parts[1].length > 2) {
            return false;
        }
        if (parts[2].length === 2) {
            year = year + 2000;
        } else if (parts[2].length !== 4) {
            return false;
        }
        if (
            month < 1 || month > 12 || day < 1 || day > 31
        ) {
            return false;
        }
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() ===  year && date.getMonth() === month - 1 && date.getDate() === day
        );
    }, "*Enter A Valid Date! (Ex: 10/05/26)"),

    notes: z.string().max(250, "*Notes Cannot Exceed 250 Character!"),

    completed: z.boolean(),
}).superRefine((data, ctx) => {
    const isCardio = [
        "Run", "Run (Treadmill)", "Walk", "Road Cycling",
    ].includes(data.exercise);

    if (isCardio) {
        const distance = Number(data.distance)
        if (
            data.distance.trim() === ""
        ) {
            ctx.addIssue({
                code: "custom", path: ["distance"], message: "*Distance Is Required!",
            });
        } else if (!Number.isFinite(distance) || distance <= 0) {
            ctx.addIssue({
                code: "custom", path: ["distance"], message: "*Please Enter A Positive Number for Distance!",
            });
        }
    }

    if (data.exercise === "Weight Lifting") {
        for (const field of ["sets", "reps"] as const) {
            const value = Number(data[field]);
            if (
                data[field].trim() === ""
            ) {
                ctx.addIssue({
                    code: "custom", path: [field], message: `*${field === "sets" ? "Sets" : "Reps"} Is Required!`
                });
            } else if (!Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
                ctx.addIssue({
                    code: "custom", path: [field], message: `*Please Enter A Positive Whole Number For ${field === "sets" ? "Sets" : "Reps"}`,
                });
            }
        }
    }
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;