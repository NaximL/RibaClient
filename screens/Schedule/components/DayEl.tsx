import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Lesson, ScheduleDay } from "../Schedule";
import { GetLesion } from "@api/GetLesion";
import { Gstyle } from "styles/gstyles";

type Schedule = {
    day: ScheduleDay;
    index: number;
    les: string | null;
    choiceDay: (index: number) => void;
    openDays: { [key: number]: boolean };
    daysOfWeek: Array<string>;
}
import { Animated } from "react-native";
import { useRef, useEffect } from "react";

const DayEl = ({ day, index, choiceDay, openDays, daysOfWeek, les }: Schedule) => {
    const { gstyles, WidgetColorText } = Gstyle();

    const animHeight = useRef(new Animated.Value(0)).current;
    const animOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (openDays[index]) {
            Animated.parallel([
                Animated.timing(animHeight, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: false,
                }),
                Animated.timing(animOpacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(animHeight, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(animOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [openDays[index]]);

    return (
        <View style={styles.daySection}>
            <TouchableOpacity
                onPress={() => choiceDay(index)}
                style={[
                    styles.dayHeader,
                    gstyles.WidgetBack,
                    openDays[index] && gstyles.ScheduleBack,
                ]}
                activeOpacity={0.85}
            >
                <Text style={[styles.dayTitle, { color: WidgetColorText }]}>
                    {daysOfWeek[index] || `День ${index + 1}`}
                </Text>
                <Text style={styles.arrow}>
                    {openDays[index] ? "▲" : "▼"}
                </Text>
            </TouchableOpacity>

            {/* Анимация раскрытия */}
            <Animated.View
                style={{
                    overflow: "hidden",
                    opacity: animOpacity,
                    maxHeight: animHeight.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 600], // максимум высоты блока
                    }),
                }}
            >
                <View style={[styles.cardsWrapper, gstyles.WidgetBack]}>
                    {day.map((urok: Lesson, lessonIndex: number) => (
                        <View
                            key={lessonIndex}
                            style={[styles.card, gstyles.ScheduleBackMini]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Text
                                        style={[
                                            styles.lessonTitle,
                                            {
                                                color:
                                                    les && JSON.parse(les).u === lessonIndex
                                                        ? "#2ecc71"
                                                        : "#007aff",
                                            },
                                        ]}
                                    >
                                        {lessonIndex + 1}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.lessonTitle,
                                            { color: WidgetColorText },
                                        ]}
                                    >
                                        {urok.urok}
                                    </Text>
                                </View>
                                <Text style={styles.timeValue}>{urok.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};
export default DayEl
const styles = StyleSheet.create({
    daySection: {
        marginBottom: 18,
        borderRadius: 18,

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