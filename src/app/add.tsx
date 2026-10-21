import { useWorkout } from "@/context/WorkoutContext";
import { Workout } from "@/data/workouts";
import { WorkoutFormValues, workoutSchema } from "@/utils/validateWorkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { router, Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

const NOTES_LIMIT = 250;
const EXERCISES = ["Run", "Run (Treadmill)", "Walk", "Road Cycling", "Weight Lifting", "Other",];
const CARDIO_EXERCISES = ["Run", "Run (Treadmill)", "Walk", "Road Cycling",];

export default function AddWorkout() {
    const { addWorkout, markWorkoutCompleted } = useWorkout();

    const {
        control, handleSubmit, watch, clearErrors, reset, formState: { errors }, } = useForm<WorkoutFormValues>({
            resolver: zodResolver(workoutSchema), mode: "onTouched", reValidateMode: "onChange", defaultValues: {
                exercise: "", duration: "", distance: "", distanceUnit: "mi", sets: "", reps: "", date: "", notes: "", completed: false,
            },
        });

    const selectExercise = watch("exercise");
    const notes = watch("notes");
    const showDistance = CARDIO_EXERCISES.includes(selectExercise);
    const showRepScheme = selectExercise === "Weight Lifting";

    function handleExerciseChange(value: string) {
        if (!value || value === selectExercise) return;
        reset ({ 
            exercise: value, duration: "", distance: "", distanceUnit: "mi", sets: "", reps: "", 
            date: "", notes: "", completed: false,}); 
            clearErrors();
        };
    
        function onValidSubmit(data: WorkoutFormValues) {
            const isCardio = CARDIO_EXERCISES.includes(data.exercise);
            const isWeightLifting = data.exercise === "Weight Lifting"
            const newWorkoutId = Date.now().toString();
            const newWorkout: Workout = {
                id: newWorkoutId,
                exercise: data.exercise,
                duration: Number(data.duration),
                distance: isCardio ? Number(data.distance) : null,
                distanceUnit: data.distanceUnit ?? "mi",
                sets: isWeightLifting ? Number(data.sets) : null,
                reps: isWeightLifting ? Number(data.reps) : null,
                date: data.date,
                notes: data.notes,
                completed: data.completed,
            };
            addWorkout(newWorkout);
            if (data.completed) {
                markWorkoutCompleted(newWorkout.id);
            }
            router.replace({ pathname: "/workouts/[id]", params: { id: newWorkoutId }
            });
        }

    return (
        <KeyboardAvoidingView style={styles.addContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Stack.Screen options={{ title: "Add Workout" }}/>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.addContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.addTitle}>Add a Workout</Text>
                <Text style={styles.addSubTitle}>Enter The Details Of Your Workout Below</Text>

                    {/* Exercise Picker */}
                    <View style={styles.addField}>
                        <Text style={styles.addLabel}>Exercise</Text>
                        <View style={styles.addPickerContainer}>
                            <Controller control={control} name="exercise" render={({ field: { value, onChange } }) => (
                                <Picker mode="dropdown" selectedValue={value} onValueChange={(value) => handleExerciseChange(value)}
                                    style={styles.addPicker} dropdownIconColor={"#ffa434"}>
                                        <Picker.Item label="Select Exercise" value="" enabled={false} color="#7c7c78"/>
                                        {EXERCISES.map((item) => (
                                            <Picker.Item key={item} label={item} value={item} color="#111111" />
                                        ))}
                                </Picker>
                            )} />
                        </View>
                        {errors.exercise && ( <Text style={styles.errorText}> {errors.exercise.message} </Text>)}
                    </View>

                    {/* Duration Input */}
                    <View style={styles.addField}>
                        <Text style={styles.addLabel}>Duration (Minutes)</Text>
                        <Controller control={control} name="duration" render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput style={styles.textInput} placeholder="(Ex: 45)" placeholderTextColor="#fcf8f3"
                            value={value} onChangeText={(text) => {onChange(text); }} onBlur={onBlur} 
                            keyboardType="numeric" />
                        )} />
                        {errors.duration && <Text style={styles.errorText}>{errors.duration.message}</Text>}
                    </View>

                    {/* Distance Conditional Input */}
                    {showDistance && (
                        <>
                            <View style={styles.addField}>
                                <Text style={styles.addLabel}>Distance</Text>
                                <Controller control={control} name="distance" render={({ field: { value, onChange, onBlur } }) => (
                                    <TextInput style={styles.textInput} placeholder="(Ex: 2.5)" placeholderTextColor="#fcf8f3"
                                    value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="decimal-pad" /> )} 
                                />
                                {errors.distance && ( <Text style={styles.errorText}> {errors.distance.message} </Text> )}
                            </View>

                            {/* Distance Unit */}
                            <View style={styles.addField}>
                                <Text style={styles.addLabel}>Distance Unit</Text>
                                <View style={styles.addPickerContainer}>
                                    <Controller control={control} name="distanceUnit" render={({ field: { value, onChange } }) => (
                                        <Picker selectedValue={value} onValueChange={onChange} style={styles.addPicker} 
                                        dropdownIconColor={"#ffa434"}>
                                            <Picker.Item label="Miles" value="mi" color="#111111"/>
                                            <Picker.Item label="Kilometers" value="km" color="#111111"/>
                                        </Picker>
                                    )} />
                                </View>
                            </View>
                        </>
                    )}

                    {/* WeightLifting Conditional Inputs: Sets & Reps */}
                    {showRepScheme && ( 
                        <>
                            <View style={styles.addField}>
                                <Text style={styles.addLabel}>Sets</Text>
                                <Controller control={control} name="sets" render={({ field: { value, onChange, onBlur } }) => (
                                    <TextInput style={styles.textInput} placeholder="(Ex: 5)" placeholderTextColor="#fcf8f3"
                                    value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" /> )} 
                                />
                                {errors.sets && ( <Text style={styles.errorText}> {errors.sets.message} </Text> )}
                            </View>

                            <View style={styles.addField}>
                                <Text style={styles.addLabel}>Reps</Text>
                                <Controller control={control} name="reps" render={({ field: { value, onChange, onBlur } }) => (
                                    <TextInput style={styles.textInput} placeholder="(Ex: 10)" placeholderTextColor="#fcf8f3"
                                    value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" /> )} 
                                />
                                {errors.reps && ( <Text style={styles.errorText}> {errors.reps.message} </Text> )}
                            </View>
                        </>
                    )}

                    {/* Date Input */}
                    <View style={styles.addField}>
                        <Text style={styles.addLabel}>Date Of Workout</Text>
                        <Controller control={control} name="date" render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput style={styles.textInput} placeholder="(Ex: MM/DD/YY)" placeholderTextColor="#fcf8f3"
                            value={value} onChangeText={onChange} onBlur={onBlur} />
                        )} />
                        {errors.date && ( <Text style={styles.errorText}> {errors.date.message} </Text> )}
                    </View>
                    
                    {/* Notes Input */}
                    <View style={styles.addField}>
                        <Text style={styles.addLabel}>Additional Notes</Text>
                        <Controller control={control} name="notes" render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput style={[styles.textInput, styles.notesInput]} placeholder="Enter Workout Notes..." 
                            placeholderTextColor={"#fcf8f3"} value={value} onChangeText={(text) => {onChange(text); }} 
                            onBlur={onBlur} multiline textAlignVertical="top" maxLength={NOTES_LIMIT}/>
                        )} />
                        <Text style={styles.characterCount}>{notes.length}/{NOTES_LIMIT} characters</Text>
                        {errors.notes && ( <Text style={styles.errorText}> {errors.notes.message} </Text> )}
                    </View>
                    
                    {/* Workout Complete Switcher */}
                    <View style={styles.switchRow}>
                        <View style={styles.switchTextContainer}>
                            <Text style={styles.addLabel}>Workout Complete</Text>
                            <Text style={styles.switchSubTitle}>Mark This Workout As Complete</Text>
                        </View>
                        <Controller control={control} name="completed" render={({ field: { value, onChange} }) => (
                        <Switch value={value} onValueChange={(checked) => {onChange(checked); }} 
                        trackColor={{false: "#555555", true: "#fd6832"}} thumbColor={"#f9fcf4"}/>
                        )} />
                    </View>
                    
                    {/* Add Workout Button */}
                    <Pressable style={({ pressed }) => [styles.addButton, pressed && 
                    styles.buttonPressed]} onPress={handleSubmit(onValidSubmit)} accessibilityRole="button" accessibilityLabel="Add Workout">
                        <Text style={styles.addButtonText}>Add Workout</Text>
                    </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    addContainer: {
        flex: 1, backgroundColor: "#111111", paddingHorizontal: 20,
    },
    addContent: {
        flexGrow: 1, gap: 18, paddingTop: 12, paddingBottom: 40,
    },
    addTitle: {
        color: "#fd6832", fontSize: 30, fontWeight: "600", textAlign: "center", textDecorationLine: "underline", marginTop: 12,
    },
    addSubTitle: {
        color:"#dad4ce", fontSize: 15, fontWeight: "200", textAlign: "center", fontStyle: "italic",
    },
    addField: {
        gap: 8,
    },
    addLabel: {
        color: "#fcf8f3", fontSize: 15, fontWeight: "600",
    },
    addPickerContainer: {
        borderWidth: 1, borderRadius: 8, borderColor: "#fd6832", overflow: "hidden",
    },
    addPicker: {
        color: "#dcd4ca",
        ...Platform.select({
            ios: {
                backgroundColor: "#c5c2c299", height: 100, justifyContent: "center",
            },
            android: {
                backgroundColor: "#272727",
            },
        }),
    },
    textInput: {
        borderWidth: 0.75, borderColor: "#fd6832", borderRadius: 5, padding: 10, minHeight: 45, backgroundColor: "#272727",
        color:"#fcf8f3", fontSize: 15,
    },
    notesInput: {
        minHeight: 110,
    },
    errorText: {
        color: "#ff0505", fontSize: 13,
    },
    characterCount: {
        color: "#97918a", fontSize: 12, textAlign: "right",
    },
    switchRow: {
        borderWidth: 1, borderColor: "#3d3d3d", borderRadius: 8, backgroundColor: "#272727", padding: 14, flexDirection: "row", 
        justifyContent: "center", alignItems: "center",
    },
    switchTextContainer: {
        flex: 1, gap: 15,
    },
    switchSubTitle: {
        color: "#97918a", fontSize: 15,
    },
    addButton: {
        padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 3,
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
    addButtonText: {
        color: "#fffaf4", fontSize: 16, fontWeight: "600",
    },
});