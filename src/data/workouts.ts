export type Workout = {
    id: string,
    exercise: string,
    duration: number, // in total minutes
    date: string
}

export const workouts: Workout[] = [
    {
        id: "1",
        exercise: "Run",
        duration: 45,
        date: "9/04/26"
    },
    {
        id: "2",
        exercise: "Weight Lifting",
        duration: 35,
        date: "9/06/26"
    },
    {
        id: "3",
        exercise: "Road Cycling",
        duration: 90,
        date: "9/09/26"
    },
    {
        id: "4",
        exercise: "Walk",
        duration: 25,
        date: "9/11/26"
    },
    {
        id: "5",
        exercise: "Weight Lifting",
        duration: 60,
        date: "9/12/26"
    },
    {
        id: "6",
        exercise: "Run",
        duration: 50,
        date: "9/15/26"
    },
    {
        id: "7",
        exercise: "Walk",
        duration: 25,
        date: "9/17/26"
    },
    {
        id: "8",
        exercise: "Run (Treadmill)",
        duration: 75,
        date: "9/19/26"
    },
    {
        id: "9",
        exercise: "Road Cycling",
        duration: 80,
        date: "9/22/26"
    },
    {
        id: "10",
        exercise: "Weight Lifting",
        duration: 35,
        date: "9/23/26"
    }
];