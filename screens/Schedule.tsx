import { useEffect, useState, useRef } from "react";
import { GetLesion } from "../api/MH/GetLesion";
import { getData } from "../components/LocalStorage";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform } from "react-native";
import useLesionStore from "../store/LesionStore";

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Gstyle } from "styles/gstyles";

const daysOfWeek = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пʼятниця",
];

interface Lesson {
    urok: string;
    time: string;
}

type ScheduleDay = Lesson[];

const Schedule = () => {
    const { gstyles } = Gstyle();

    const [openDays, setOpenDays] = useState<{ [key: number]: boolean }>({});
    const setLesions = useLesionStore((state) => state.setLesions);
    const Lesion = useLesionStore((state) => state.lesion);
    const [Le, setLe] = useState<ScheduleDay[]>([])
    const [anim] = useState(useRef(new Animated.Value(0)).current);


    useFocusEffect(
        useCallback(() => {
            anim.setValue(0);
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

        }, [])
    );


    const toggleDay = (index: number) => {
        setOpenDays((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    useEffect(() => {

        let d = Lesion;
        setLe(d)
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [])

    return (
        <ScrollView style={[styles.container, gstyles.back]} showsVerticalScrollIndicator={false}>
            <Animated.View style={{
                opacity: anim,
                transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }
                ]
            }}>
                {Lesion.length === 0 || Lesion[0].length === 0 ? (
                    <Text style={styles.emptyText}>На даний момент уроків немає.</Text>
                ) : (
                    <>
                        {Array.isArray(Le) && Le.map((day: ScheduleDay, index: number) => (
                            <View key={index} style={styles.daySection}>
                                <TouchableOpacity
                                    onPress={() => toggleDay(index)}
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
                            </View>
                        ))}
                    </>
                )}
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 16,
        paddingVertical: 50,
    },
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
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#aaa",
        fontSize: 16,
    },
});

export default Schedule;
