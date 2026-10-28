import { WorkoutRow as Workout } from "@/api/workouts";
import { StyleSheet, Text, View } from "react-native";

export default function WorkoutRow({ workout }: { workout: Workout }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardMain}>
                <Text style={styles.cardExerciseLabel}> Activity: {" "}</Text>
                <Text style={styles.cardExerciseValue}> {workout.exercise}</Text>
                <Text style={styles.cardDurationLabel}> Duration: {" "}</Text>
                <Text style={styles.cardDurationValue}> {workout.duration} Minutes</Text>
            </View>
            <View style={styles.cardDate}>
                <Text style={styles.cardDateValue}>{workout.date}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 12, borderRadius: 8, backgroundColor: "#272727", borderWidth: 1, borderColor: "#3d3d3d",
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    },
    cardMain: {
        flex: 1, gap: 3,
    },
    cardExerciseLabel: {
        color: "#dcd4ca", fontSize: 15, fontWeight: "400",
    },
    cardExerciseValue: {
        color: "#faf6f1", fontWeight: "600",
    },
    cardDurationLabel: {
        color: "#dcd6cf", fontSize: 15, fontWeight: "400",
    },
    cardDurationValue: {
        color: "#f9a022", fontWeight: "600",
    },
    cardDate: {
        alignItems: "flex-end",
    },
    cardDateValue: {
        color: "#f96733", fontSize: 15, fontWeight: "600",
    }
});