import { useEffect, useState, useRef } from "react";

import { getData } from "../../components/LocalStorage";
import { Text, StyleSheet, ScrollView, Animated, Platform } from "react-native";
import useLesionStore from "../../store/LesionStore";

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Gstyle } from "styles/gstyles";
import DayEl from "./components/DayEl";
import useUrokStore from "@store/UrokStore";

import FullScreenModal from "@components/Modal";

const daysOfWeek = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пʼятниця",
];

export interface Lesson {
    num: number;
    urok: string;
    time: string;
    teach: string;
}

export type ScheduleDay = Lesson[];

const Schedule = () => {
    const { gstyles, WidgetColorText } = Gstyle();

    const [openDays, setOpenDays] = useState<{ [key: number]: boolean }>({});
    const Urok = useUrokStore((state) => state.Urok);
    const { lesion, setLesions } = useLesionStore((state) => state);
    const [ModalVis, SetModalVis] = useState(false)
    const [ModalData, SetModalData] = useState<Lesson>({
        "num": 1,
        "urok": "Інформатика",
        "time": "8:00 - 8:40",
        "teach": "Іванова Вікторія"
    },)


    const [Le, setLe] = useState<ScheduleDay[]>([])
    const [anim] = useState(useRef(new Animated.Value(0)).current);

    const update = async () => {
        const schedule: any = await getData("schedule");
        if (!schedule) return;
        setLesions(JSON.parse(schedule));
    }

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
        update()
    }, [])
    useEffect(() => {
        const today = new Date();
        const dayIndex = today.getDay() - 1;
        dayIndex && toggleDay(dayIndex);
        const p = lesion.filter((day) => day.length > 0);
        setLe(p)
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [lesion])

    return (
        <ScrollView style={[styles.container, gstyles.back]} showsVerticalScrollIndicator={false}>
            <FullScreenModal
                visible={ModalVis}
                onClose={() => SetModalVis(false)}
            >
                <Text style={{ color: WidgetColorText, fontWeight: '700', fontSize: 30 }}>{ModalData.urok}</Text>
                <Text style={{ color: WidgetColorText, fontWeight: '500', fontSize: 23, marginTop: 10 }}>{`Вчитель: \n${ModalData.teach}`}</Text>
            </FullScreenModal>

            <Animated.View style={{
                opacity: anim,
                paddingBottom: Platform.OS === "android" ? 200 : 150,
                transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }
                ]
            }}>
                {lesion.length === 0 || lesion[0].length === 0 ? (
                    <Text style={styles.emptyText}>На даний момент уроків немає.</Text>
                ) : (
                    <>
                        {Array.isArray(Le) && Le.map((day: ScheduleDay, index: number) => (
                            <DayEl setModalData={SetModalData} setModalVis={SetModalVis} les={Urok ? JSON.parse(Urok).d === index ? Urok : null : null} day={day} key={index} choiceDay={toggleDay} index={index} openDays={openDays} daysOfWeek={daysOfWeek} />
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

        paddingTop: Platform.OS === "ios" || Platform.OS === "android" ? 80 : 16,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 8,
        color: "#aaa",
        fontSize: 16,
    },
});

export default Schedule;
