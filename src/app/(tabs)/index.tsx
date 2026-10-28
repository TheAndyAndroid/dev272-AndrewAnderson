import { fetchAllWorkouts } from "@/api/workouts";
import WorkoutRow from "@/components/WorkoutRow";
import { useWorkout } from "@/context/WorkoutContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";

function parseWorkoutDate(date: string): number {
  const [month, day, year] = date.split("/").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day).getTime();
}

export default function Index() {
  const [query, setQuery] = useState("");
  const { sortOrder, setSortOrder } = useWorkout();
  const {
    data: workouts = [],
    isLoading, isError, refetch, isRefetching,
  } = useQuery({ queryKey: ["workouts"], queryFn: fetchAllWorkouts});
  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateA = parseWorkoutDate(a.date);
    const dateB = parseWorkoutDate(b.date);
    return sortOrder === "newest"
    ? dateB - dateA : dateA - dateB;
  });
  const filteredWorkouts = sortedWorkouts.filter((workout) => {
    const searchText = query.trim().toLowerCase();
    return (
      workout.exercise.toLowerCase().includes(searchText) || workout.date.toLowerCase().includes(searchText)
    );
  });

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#fd6832" />
        <Text style={styles.messageText}>Loading Workouts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.emptyTitle}>Could Not Load Workouts!</Text>
        <Text style={styles.messageText}>Please Check Internet Connection and Try Again!</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.buttonText}>Try Again!</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>  (
          <Link href={{ pathname: "/workouts/[id]", params: { id: item.id }}} asChild>
            <Pressable>
              <WorkoutRow workout={item} />
            </Pressable>
          </Link>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={"#fd6832"}
            colors={["#fd6832"]}
          />
        }
        ListHeaderComponent={
          <Header query={query} setQuery={setQuery} onClear={() => setQuery("")} sortOrder={sortOrder} setSortOrder={setSortOrder}/>
        }
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{workouts.length === 0 ? "No Exercises Yet!" : "No Workouts Match!"}</Text>
              <Text style={styles.emptyText}>{workouts.length === 0 ? "Add A Workout To Begin!" : "Try Searching For A Different Workout!"}</Text>
            </View>
        }
        contentContainerStyle={styles.list}
      />
      <View style={styles.addButtonContainer}>
          <Pressable onPress={() => router.push("/add")} style={({ pressed }) => [ pressed && styles.buttonPressed,]}
          accessibilityRole="button" accessibilityLabel="Add workout">
          <Ionicons name="add" size={32} color={"#f6f3f0"}/>
          </Pressable>
      </View>
    </View>
  );
}

function  Header({query, setQuery, onClear, sortOrder, setSortOrder}:
{
  query: string;
  setQuery: (query: string) => void;
  onClear: () => void;
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
}) { 
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Text style={styles.subTitle}>Keep Track of Your Previous Workouts</Text>
      <View style={styles.workoutSearchbar}>
        <TextInput style={styles.input} 
        placeholder="Search Workouts By Name Or Date..."
        placeholderTextColor="#a8a29e"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        />
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={ onClear } accessibilityRole="button" accessibilityLabel="Clear Search">
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>
      <Text style={styles.characterLength}>{query.length} characters</Text>
      <Text style={styles.sortLabel}>Sort Workouts</Text>
      <View style={styles.sortRow}>
        <Pressable onPress={() => setSortOrder("newest")} style={[styles.sortButton, sortOrder === "newest" && styles.selectedSortButton]}
        accessibilityRole="button" accessibilityState={{selected: sortOrder === "newest"}}>
          <Text style={styles.buttonText}>Newest First</Text>
        </Pressable>
        <Pressable onPress={() => setSortOrder("oldest")} style={[styles.sortButton, sortOrder === "oldest" && styles.selectedSortButton]}
        accessibilityRole="button" accessibilityState={{selected: sortOrder === "oldest"}}>
          <Text style={styles.buttonText}>Oldest First</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>Previous Sessions</Text>
      <Text style={styles.sectionSubTitle}>Click on a card to view additional details for a workout</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  list: {
    padding: 15, gap: 20, backgroundColor: "#111111"
  },
  addButtonContainer: {
    position: "absolute", bottom: 25, right: 20, width: 60, height: 60, borderRadius: 30, overflow: "hidden",
    elevation: 5, zIndex: 10, backgroundColor: "#fd6832", alignItems: "center", justifyContent: "center",
  },
  mainContainer: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12,
  },
  title: {
    fontSize: 30, fontWeight: "600", textAlign: "center", color: "#fcf8f3"
  },
  subTitle: {
    fontSize: 15, color: "#dad4ce", marginBottom: 12
  },
  workoutSearchbar: {
    flexDirection: "row", gap: 8, alignItems: "center"
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: "#fd6832", borderRadius : 15, padding: 10, height: 40, 
    backgroundColor: "#414141", color: "#fffaf5"
  },
  button: {
    paddingHorizontal: 10, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios: {
        backgroundColor: "#db8127"
      },
      android: {
        backgroundColor: "#d45020"
      }})
  },
  buttonPressed: {
    opacity: 0.5
  },
  buttonText: {
    color: "#fffaf4", fontSize: 15, fontWeight: "600"
  },
  characterLength: {
    alignSelf: "flex-start", paddingLeft: 2, fontSize: 12, color: "#97918a"
  },
  sortLabel: {
    alignSelf: "center", color: "#fcf8f3", fontSize: 17, fontWeight: "600",
  },
  sortRow: {
    alignSelf: "center", flexDirection: "row", gap: 10, 
  },
  sortButton: {
    padding: 10, borderRadius: 8, backgroundColor: "#414141",
  },
  selectedSortButton: {
    backgroundColor: "#fd6832",
  },
  sectionTitle: {
    fontSize: 20, fontWeight: "400", textDecorationLine: "underline", marginTop: 12,
    color: "#fcf8f3"
  },
  sectionSubTitle: {
    fontSize: 15, fontWeight: "200", textAlign: "center", color: "#fcf8f3", fontStyle: "italic"
  },
  emptyContainer: {
    backgroundColor: "#272727", borderWidth: 1, borderColor: "#3d3d3d", borderRadius: 8,
    padding: 25, alignItems: "center", marginTop: 10,
  },
  emptyTitle: {
    color: "#fcf8f3", fontSize: 20, fontWeight: "600", textAlign: "center",
  },
  emptyText: {
    color: "#97918a", fontSize: 14, textAlign: "center", marginTop: 8,
  },
  messageContainer: {
    flex: 1, backgroundColor: "#111111", justifyContent: "center", alignItems: "center", padding: 25, gap: 15, 
  },
  messageText: {
    color: "#fcf8f3", fontSize: 15, textAlign: "center",
  },
  retryButton: {
    borderRadius: 8, backgroundColor: "#fd6832",
  }
});