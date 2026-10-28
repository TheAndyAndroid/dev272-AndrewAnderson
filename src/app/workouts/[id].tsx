import { completeWorkout, fetchWorkout } from "@/api/workouts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WorkoutDetail() {
    const { id } = useLocalSearchParams<{id: string}>();
    const queryClient = useQueryClient();
    const { data: workout, isLoading, isError, refetch } = useQuery({
        queryKey: ["workouts", id], queryFn: () => fetchWorkout(id),
        enabled: Boolean(id),
    });
    const completeMutation = useMutation({mutationFn: () => completeWorkout(id), onSuccess: async () => {
        await queryClient.invalidateQueries({
                queryKey: ["workouts"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["workouts", id],
            })
        router.replace("/(tabs)/progress")
    },
    onError: (error) => {
        Alert.alert(
            "Could Not Complete Workout!", error.message
        );
    },
});

    if (isLoading) {
        return (
            <View style={styles.messageContainer}>
                <ActivityIndicator size="large" color={"#fd6832"} />
                <Text style={styles.messageText}>Loading Workout...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.emptyTitle}>Could Not Load Workout!</Text>
                <Text style={styles.messageText}>Check Internet Connection, Then Try Again!</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.buttonText}>Try Again!</Text>
                </Pressable>
            </View>
        );
    }

    if (!workout) {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.emptyTitle}>Workout Not Found!</Text>
                <Text style={styles.messageText}>This Workout Cannot Be Found As It's Either Removed or Invalid!</Text>
                <Pressable style={styles.retryButton} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

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
                <Text style={styles.cardValue}>{workout.distance.toFixed(2)}{" "} {workout.distance_unit}</Text>
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
                <Text style={[styles.cardValue, { color: workout.completed ? "#37a056" : "#ff4026" }]}>
                {workout.completed ? "Completed ✓" : "Not Completed ✗"}</Text>
            </View>
            {!workout.completed && (
                <>
                <Text style={styles.miniLabel}>Click The Button To Add Workout To Statistic Page!</Text>
                <Pressable style={({ pressed }) => [styles.completeButton, completeMutation.isPending && styles.buttonDisabled,
                pressed && styles.buttonPressed]} disabled={completeMutation.isPending} onPress={() => completeMutation.mutate()}>
                <Text style={styles.completedButtonText}>{completeMutation.isPending ? "Saving..." : "Mark Workout Complete"}</Text>
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
        opacity: 0.6,
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    completedButtonText: {
        color: "#fffaf4", fontSize: 15, fontWeight: "600"
    },
    messageContainer: {
        flex: 1, backgroundColor: "#111111", justifyContent: "center", alignItems: "center", 
    },
    messageText: {
        color: "#fcf8f3", fontSize: 12, textAlign: "center", 
    },
    emptyTitle: {
        color: "#fcf8f3", fontSize: 18, fontWeight: "600", textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#fd6832", borderRadius: 8, alignItems: "center",
    },
    buttonText: {
        color: "#fffaf4", fontSize: 12, fontWeight: "600",
    }
});