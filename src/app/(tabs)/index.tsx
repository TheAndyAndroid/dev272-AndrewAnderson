import WorkoutRow from "@/components/WorkoutRow";
import { useWorkout } from "@/context/WorkoutContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function parseWorkoutDate(date: string): number {
  const [month, day, year] = date.split("/").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day).getTime();
}

export default function Index() {
  const { workouts } = useWorkout();
  const [query, setQuery] = useState("");
  const sortedWorkouts = [...workouts].sort((a, b) => {
    return parseWorkoutDate(b.date) - parseWorkoutDate(a.date)
  })
  const filteredWorkouts = sortedWorkouts.filter((workout) => {
    const searchText = query.trim().toLowerCase();
    return (
      workout.exercise.toLowerCase().includes(searchText) || workout.date.toLowerCase().includes(searchText)
    );
  });

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
        ListHeaderComponent={
          <Header query={query} setQuery={setQuery} onClear={() => setQuery("")}/>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Exercises Match!</Text>
            <Text style={styles.emptyText}>Try Searching For A Different Exercise!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
      <View style={styles.addButtonContainer}>
        <Link href="/add" asChild>
          <Pressable style={({ pressed }) => [ pressed && styles.buttonPressed,]}
          accessibilityRole="button" accessibilityLabel="Add workout">
          <Ionicons name="add" size={32} color={"#f6f3f0"}/>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function  Header({query, setQuery, onClear}:
{
  query: string;
  setQuery: (query: string) => void;
  onClear: () => void;
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
});