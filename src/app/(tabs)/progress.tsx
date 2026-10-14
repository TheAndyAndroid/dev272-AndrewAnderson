import { useWorkout } from "@/context/WorkoutContext";
import { Workout, workouts } from "@/data/workouts";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Progress() {
    const { completedWorkouts } = useWorkout();
    const completedWorkoutList: Workout[] = [];
    for (const workout of workouts) {
        const foundWorkout = completedWorkouts.find ((item) => item.workoutid === workout.id);
        if (foundWorkout) {
            completedWorkoutList.push(workout);
        }
            };
    const totalCompleted = completedWorkoutList.length;
    let totalMinutes = 0;
    for (const workout of completedWorkoutList) {
        totalMinutes = totalMinutes + workout.duration
    }
    let averageMinutes = 0;
    if (totalCompleted > 0) {
        averageMinutes = Math.round(totalMinutes / totalCompleted);
    }
    const exerciseCounts: Record<string, number> = {};
    for (const workout of completedWorkoutList) {
        const exerciseName = workout.exercise
        if (exerciseCounts[exerciseName] === undefined) {
            exerciseCounts[exerciseName] = 1;
        } else {
            exerciseCounts[exerciseName] = exerciseCounts[exerciseName] + 1;
        }
    }
    const exerciseBreakdown: { exercise: string; count: number }[] = [];
    for (const exercise in exerciseCounts) {
        exerciseBreakdown.push({
            exercise: exercise,
            count: exerciseCounts[exercise]
        });
    }
    exerciseBreakdown.sort((a, b) => b.count - a.count);

    const longestWorkouts = [...completedWorkoutList];
    longestWorkouts.sort((a, b) => b.duration - a.duration);
    const topThree = longestWorkouts.slice(0, 3)

        return (
            <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}>
                <Text style={styles.title}>Your Progress</Text>
                <Text style={styles.subTitle}>Workout History Statisitcs</Text>
                {totalCompleted === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No Completed Workouts Yet</Text>
                        <Text style={styles.emptyText}>Add workouts to your history to start tracking your progress</Text>
                    </View>
                ) : (
                    <>
                    <View style={styles.statsRow}>
                        <StatCard exerciseValue={totalCompleted.toString()} exerciseLabel="Total Workouts"/>
                        <StatCard exerciseValue={Math.floor(totalMinutes / 60) + " h " + (totalMinutes % 60) + " m"} exerciseLabel="Total Time"/>
                    </View>
                    <View style={styles.statsRow}>
                        <StatCard exerciseValue={averageMinutes + " min"} exerciseLabel="Average Workout"/>
                        <StatCard exerciseValue={exerciseBreakdown.length > 0 ? exerciseBreakdown[0].exercise : "N/A"} exerciseLabel="Most Frequent"/>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Workout Breakdown</Text>
                        <Text style={styles.sectionSubTitle}>Workout Activity based on Exercise Type</Text>
                            {exerciseBreakdown.map((item) => {
                                const percentage = (item.count / totalCompleted) * 100;
                                return (
                                    <View key={item.exercise} style={styles.activityRow}> 
                                        <View style={styles.activityHeader}>
                                            <Text style={styles.activityName}>{item.exercise}</Text>
                                            <Text style={styles.activityCount}>{item.count}</Text>
                                        </View>
                                        <View style={styles.progressBackground}>
                                            <View style={[styles.progressBar, { width: `${percentage}%` as `${number}%`},]}/>
                                        </View>
                                    </View>
                                );
                            })}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top 3 Longest Workouts</Text>
                        <Text style={styles.sectionSubTitle}>Your Workouts Ordered By Duration</Text>
                        {topThree.map((workout) => (
                            <View key={workout.id} style={styles.completedRow}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.completedName}>{workout.exercise}</Text>
                                    <Text style={styles.completedDetails}>{workout.duration} minutes</Text>
                                </View>
                                <Text style={styles.completedDate}>{workout.date}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    )
};

function StatCard({ exerciseValue, exerciseLabel,}: {
    exerciseValue: string;
    exerciseLabel: string;
}) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{exerciseValue}</Text>
            <Text style={styles.statLabel}>{exerciseLabel}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#111111"
    },
    content: {
        padding: 15, paddingBottom: 40, gap: 15,
    },
    title: {
        fontSize: 30, fontWeight: "600", textAlign: "center", color: "#fcf8f3", marginTop: 15,
    },
    subTitle: {
        fontSize: 15, color: "#dad4ce", textAlign: "center", marginBottom: 10,
    },
    statsRow: {
        flexDirection: "row", gap: 15,
    },
    statCard: {
        flex: 1, padding: 18, borderRadius: 8, backgroundColor: "#272727", borderWidth: 1, borderColor: "#3d3d3d",
        alignItems: "center", justifyContent: "center", minHeight: 105,
    },
    statValue: {
        color: "#f9a022", fontSize: 22, fontWeight: "600", textAlign: "center",
    },
    statLabel: {
        color: "#dcd4ca", fontSize: 13, marginTop: 7, textAlign: "center",
    },
    section: {
        padding: 18, borderRadius: 8, backgroundColor: "#272727", borderWidth: 1, borderColor: "#3d3d3d",
    },
    sectionTitle: {
        color: "#fcf8f3", fontSize: 20, fontWeight: "600",
    },
    sectionSubTitle: {
        color: "#97918a", fontSize: 13, marginTop: 4, marginBottom: 20,
    },
    activityRow: {
        marginBottom: 15,
    },
    activityHeader: {
        flexDirection: "row", justifyContent: "space-between", marginBottom: 6,
    },
    activityName: {
        color: "#dcd4ca", fontSize: 14,
    },
    activityCount: {
        color: "#f96733", fontWeight: "600",
    },
    progressBackground: {
        height: 9, backgroundColor: "#df4d1873", borderRadius: 10, overflow: "hidden",
    },
    progressBar: {
        height: "100%", backgroundColor: "#fd6832", borderRadius: 10,
    },
    completedRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: "#f9a022",
    },
    completedName: {
        color: "#fcf8f3", fontSize: 15, fontWeight: "600",
    },
    completedDetails: {
        color: "#97918a", marginTop: 3,
    },
    completedDate: {
        color: "#f96733", fontSize: 12,
    },
    emptyCard: {
        backgroundColor: "#272727", borderWidth: 1, borderColor: "#3d3d3d", borderRadius: 8,
        padding: 25, alignItems: "center", marginTop: 10,
    },
    emptyTitle: {
        color: "#fcf8f3", fontSize: 20, fontWeight: "600", textAlign: "center",
    },
    emptyText: {
        color: "#97918a", fontSize: 14, textAlign: "center", lineHeight: 21, marginTop:10,
    }
});