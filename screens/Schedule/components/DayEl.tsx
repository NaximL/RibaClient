import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Lesson, ScheduleDay } from "../Schedule";

type Schedule = {
    day: ScheduleDay;
    index: number;
    choiceDay: (index: number) => void;
    openDays: { [key: number]: boolean };
    daysOfWeek: Array<string>;
}
const DayEl = ({ day, index, choiceDay, openDays, daysOfWeek }: Schedule) => {
    return (
        <View style={styles.daySection}>
            <TouchableOpacity
                onPress={() => choiceDay(index)}
                style={[
                    styles.dayHeader,
                    openDays[index] && styles.dayHeaderActive,
                ]}
                activeOpacity={0.85}
            >
                <Text style={styles.dayTitle}>
                    {daysOfWeek[index] || `День ${index + 1}`}
                </Text>
                <Text style={styles.arrow}>
                    {openDays[index] ? "▲" : "▼"}
                </Text>
            </TouchableOpacity>
            {openDays[index] && (
                <View style={styles.cardsWrapper}>
                    {day.map((urok: Lesson, lessonIndex: number) => (
                        <View key={lessonIndex} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.lessonTitle}>{urok.urok}</Text>
                                <Text style={styles.timeValue}>{urok.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>);
}

export default DayEl;



const styles = StyleSheet.create({
    daySection: {
        marginBottom: 18,
        borderRadius: 18,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    dayHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        paddingHorizontal: 22,
        borderTopLeftRadius: 18,
        borderRadius: 18,
        backgroundColor: "#f2f2f7",
    },
    dayHeaderActive: {
        backgroundColor: "#e5e5ea",
    },
    dayTitle: {
        fontSize: 19,
        fontWeight: "600",
        color: "#222",
    },
    arrow: {
        fontSize: 19,
        color: "#888",
    },
    cardsWrapper: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    card: {
        backgroundColor: "#f2f2f7",
        borderRadius: 14,
        padding: 14,
        marginTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222",
    },
    timeValue: {
        fontSize: 15,
        color: "#007aff",
        fontWeight: "600",
    }
})