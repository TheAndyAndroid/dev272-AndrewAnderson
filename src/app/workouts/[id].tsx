import { useWorkout } from "@/context/WorkoutContext";
import { workouts } from "@/data/workouts";
import { Stack, useLocalSearchParams } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function WorkoutDetail() {
    const { id } = useLocalSearchParams<{id: string}>();
    const workout = workouts.find((item) => item.id === id);
    const { markWorkoutCompleted, isWorkoutCompleted} = useWorkout();

    if (!workout) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundTitle}>Workout Not Found</Text>
                <Text style={styles.notFoundText}>Can't find a workout with {id}</Text>
            </View>
        );
    }

    const completed = isWorkoutCompleted(workout.id);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Workout: ${workout.exercise}` }} />
            <Text style={styles.title}>Additional Details</Text>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Activity</Text>
                <Text style={styles.cardValue}>{workout.exercise}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Duration</Text>
                <Text style={styles.cardValue}>{workout.duration} minutes</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Workout Date</Text>
                <Text style={styles.cardValue}>{workout.date}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Notes</Text>
                <Text style={styles.cardValue}>(Feature Coming Soon!)</Text>
            </View>
            <Text style={styles.miniLabel}>Click the button to add this exercise to the statistics page</Text>
            <Pressable 
            disabled={completed}
            onPress={() => markWorkoutCompleted(workout.id)}
            style={({ pressed }) => 
                [styles.completeButton, completed && styles.completedButton, pressed && !completed && styles.buttonPressed]}>
                <Text style={styles.completedButtonText}>{completed ? "✓ Workout Completed" : "Mark Workout Completed"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#111111", padding: 20, gap: 12,
    },
    title: {
        color: "#fd6832", fontSize: 30, fontWeight: "600", marginBottom: 10, textDecorationLine: "underline",
    },
    card: {
        backgroundColor: "#272727", borderColor: "#3d3d3d", borderWidth: 1, borderRadius: 8, padding: 18,
    },
    cardLabel: {
        color: "#97918a", fontSize: 13, marginBottom: 5,
    },
    cardValue: {
        color: "#f9a022", fontSize: 18, fontWeight: "600",
    },
    miniLabel: {
        fontSize: 12, fontWeight: "200", textAlign: "center", color: "#fcf8f3", fontStyle: "italic"
    },
    completeButton: {
        borderRadius: 8, padding: 15, alignItems: "center", marginTop: 5,
        ...Platform.select ({
            ios: {
                backgroundColor: "#db8127",
            },
            android: {
                backgroundColor: "#fd6832",
            },
        })
    },
    buttonPressed: {
        opacity: 0.5,
    },
    completedButton: {
        ...Platform.select ({
            ios: {
                backgroundColor: "#41935a",
            },
            android: {
                backgroundColor: "#2d6a3f",
            }
        })
    },
    completedButtonText: {
        color: "#fffaf4", fontSize: 15, fontWeight: "600"
    },
    notFound: {
        flex: 1, backgroundColor: "#111111", justifyContent: "center", alignItems: "center", padding: 30,
    },
    notFoundTitle: {
        color: "#fcf8f3", fontSize: 25, fontWeight: "600",
    },
    notFoundText: {
        color: "#97918a", fontSize: 15, marginTop: 10, textAlign: "center",
    },
});