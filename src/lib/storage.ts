import AsyncStorage from "@react-native-async-storage/async-storage";

export async function loadJson<T>(
    key: string,
    defaultValue: T
) : Promise<T> {
    try {
        const savedValue = await AsyncStorage.getItem(key);
        if (savedValue === null) {
            return defaultValue;
        }
        return JSON.parse(savedValue) as T;
    } catch (error) {
        console.log("Could Not Load Saved Data:", error);
        return defaultValue;
    }
}

export async function saveJson<T>(
    key: string,
    value: T
): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
    console.log("Could Not Save Data:", error)
    }
}