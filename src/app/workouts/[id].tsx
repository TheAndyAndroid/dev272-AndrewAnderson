import { useWorkout } from "@/context/WorkoutContext";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WorkoutDetail() {
    const { id } = useLocalSearchParams<{id: string}>();
    const { workouts, markWorkoutCompleted, isWorkoutCompleted} = useWorkout();
    const workout = workouts.find((item) => item.id === id);

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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            {workout.distance !== null && (
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Distance</Text>
                <Text style={styles.cardValue}>{workout.distance.toFixed(2)} {workout.distanceUnit}</Text>
            </View>
            )}
            {workout.sets !== null && (
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Sets</Text>
                <Text style={styles.cardValue}>{workout.sets}</Text>
            </View>
            )}
            {workout.reps !== null && (
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Reps</Text>
                <Text style={styles.cardValue}>{workout.reps}</Text>
            </View>
            )}
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Workout Date</Text>
                <Text style={styles.cardValue}>{workout.date}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Notes</Text>
                <ScrollView style={styles.notesContainer} nestedScrollEnabled>
                    <Text style={styles.cardValue}>{workout.notes.trim() || "No Notes Available!"}</Text>
                </ScrollView>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Workout Status</Text>
                <Text style={[styles.cardValue, { color: completed ? "#37a056" : "#ff4026" }]}>{completed ? "Completed ✓" : "Not Completed ✗"}</Text>
            </View>
            {!completed && (
                <>
                <Text style={styles.miniLabel}>Click the button to add this exercise to the statistics page</Text>
                <Pressable onPress={() => {markWorkoutCompleted(workout.id); router.replace("/(tabs)/progress")}}
                style={({ pressed }) => [styles.completeButton, pressed && styles.buttonPressed,]}>
                <Text style={styles.completedButtonText}>Mark Workout Complete</Text>
                </Pressable>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#111111",
    },
    content: {
        padding: 20, gap: 12,
    },
    title: {
        color: "#fd6832", fontSize: 30, fontWeight: "600", marginBottom: 10, textDecorationLine: "underline",
    },
    card: {
        backgroundColor: "#272727", borderColor: "#3d3d3d", borderWidth: 1, borderRadius: 8, padding: 15,
    },
    cardLabel: {
        color: "#97918a", fontSize: 13, marginBottom: 5,
    },
    cardValue: {
        color: "#f9a022", fontSize: 18, fontWeight: "600",
    },
    notesContainer: {
        maxHeight: 150,
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