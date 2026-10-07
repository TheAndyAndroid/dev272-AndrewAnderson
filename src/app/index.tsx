import { Workout, workouts } from "@/data/workouts";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <FlatList
    data={workouts}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <WorkoutRow workout={item} />}
    ListHeaderComponent={<Header/>}
    contentContainerStyle={styles.list}
    />
  );
}

function  Header() {
  const [query, setQuery] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker App</Text>
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
        onPress={() => console.log({"Search": query})}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
      <Text style={styles.characterLength}>{query.length} characters</Text>
      <Text style={styles.sectionTitle}>Previous Sessions</Text>
    </View>
  );
}

function WorkoutRow({ workout }: { workout: Workout }) {
  return (
  <View style={styles.card}>
    <View style={styles.cardMain}>
      <Text style={styles.cardExerciseLabel}>Activity: {" "}
        <Text style={styles.cardExerciseValue}>{workout.exercise}
        </Text>
      </Text>
      <Text style={styles.cardDurationLabel}>Duration of Exercise: {" "}
        <Text style={styles.cardDurationValue}>{workout.duration} minutes
        </Text>
      </Text>
    </View>
    <View style={styles.cardDate}>
      <Text style={styles.cardDateValue}>{workout.date}</Text>
    </View>  
  </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 15,
    gap: 20,
    backgroundColor: "#111111"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12
  },
  title: {
    fontSize: 30,
    fontWeight: 600,
    textAlign: "center",
    color: "#fcf8f3"
  },
  subTitle: {
    fontSize: 15,
    color: "#dad4ce",
    marginBottom: 12
  },
  workoutSearchbar: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fd6832",
    borderRadius : 15,
    padding: 10,
    height: 40,
    backgroundColor: "#414141",
    color: "#fffaf5"
  },
  button: {
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        backgroundColor: "#db8127"
      },
      android: {
        backgroundColor: "#d45020"
      }
    })
  },
  buttonPressed: {
    opacity: 0.5
  },
  buttonText: {
    color: "#fffaf4",
    fontSize: 15,
    fontWeight: 600
  },
  characterLength: {
    alignSelf: "flex-start",
    paddingLeft: 2,
    fontSize: 12,
    color: "#97918a"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 400,
    textDecorationLine: "underline",
    marginTop: 12,
    color: "#fcf8f3"
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#272727",
    borderWidth: 1,
    borderColor: "#3d3d3d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  cardMain: {
    flex: 1,
    gap: 3
  },
  cardExerciseLabel: {
    color: "#dcd4ca",
    fontSize: 15,
    fontWeight: 400
  },
  cardExerciseValue: {
    color: "#faf6f1",
    fontWeight: 600
  },
  cardDurationLabel: {
    color: "#dcd6cf",
    fontSize: 15,
    fontWeight: 400
  },
  cardDurationValue: {
    color: "#f9a022",
    fontWeight: 600
  },
  cardDate: {
    alignItems: "flex-end"
  },
  cardDateValue: {
    color: "#f96733",
    fontSize: 15,
    fontWeight: 600
  }
});
