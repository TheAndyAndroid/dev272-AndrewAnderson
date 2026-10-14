import WorkoutRow from "@/components/WorkoutRow";
import { workouts } from "@/data/workouts";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [query, setQuery] = useState("");
  const filteredWorkouts = workouts.filter((workout) => workout.exercise.toLowerCase().includes(query.trim().toLowerCase())
);

  return (
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
  );
}

function  Header({query, setQuery, onClear}:
{
  query: string;
  setQuery: (query: string) => void;
  onClear: () => void;
}) { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Text style={styles.subTitle}>Keep Track of Your Previous Workouts</Text>
      <View style={styles.workoutSearchbar}>
        <TextInput style={styles.input} 
        placeholder="Search Workouts..."
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
  list: {
    padding: 15, gap: 20, backgroundColor: "#111111"
  },
  container: {
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