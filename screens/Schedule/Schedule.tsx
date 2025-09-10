import { useEffect, useState, useRef } from "react";
import { GetLesion } from "../../api/MH/GetLesion";
import { getData } from "../../components/LocalStorage";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform } from "react-native";
import useLesionStore from "../../store/LesionStore";

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Gstyle } from "styles/gstyles";
import DayEl from "./components/DayEl";

const daysOfWeek = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пʼятниця",
];

export interface Lesson {
    urok: string;
    time: string;
}

export type ScheduleDay = Lesson[];

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
                useNativeDriver: Platform.OS !== 'web',
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
        d.pop();
        d.pop();
        setLe(d)
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
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
                            <DayEl day={day} key={index} choiceDay={toggleDay} index={index} openDays={openDays} daysOfWeek={daysOfWeek} />
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
    emptyText: {
        textAlign: "center",
        marginTop: 8,
        color: "#aaa",
        fontSize: 16,
    },
});

export default Schedule;
