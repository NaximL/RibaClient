import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    Animated,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";
import { getData } from "@components/LocalStorage";
import { fetchData } from "@api/MH/GetAlldata";
import useHomeWorkStore, { HomeworkByDay, HomeworkItem } from "@store/HomeWorkStore";
import RenderHTML from "react-native-render-html";
import FullScreenModal from "../../components/Modal";
import HomeWorkEl from "./components/HomeWorkEl";

export default function HomeWork() {
    const { gstyles, WidgetColorText } = Gstyle();
    const [Load, SetLoad] = useState(true);
    const [ModalVisible, SetModalVisible] = useState(false);
    const [Select, SetSelect] = useState<HomeworkItem | null>(null);
    const [sections, setSections] = useState<{ title: string; data: HomeworkItem[] }[]>([]);

    const { SetHomeWork } = useHomeWorkStore();
    const cardAnim = useRef(new Animated.Value(0)).current;

    const getHomeWork = async () => {
        console.time("HomeWork");

        const tokens = await getData("tokens");
        if (!tokens) return;

        try {
            const today = new Date();

            const days = [0, 1, 2].map((offset) => {
                const date = new Date(today);
                date.setDate(today.getDate() + offset);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}T00:00:00+03:00`;
            });
            type HomeworkByDay = {
                0: HomeworkItem[];
                1: HomeworkItem[];
                2: HomeworkItem[];
            };


            const results: HomeworkByDay[] = await Promise.all(
                days.map(async (day, index) => {
                    try {
                        const res = await fetchData("homework", tokens, day);

                        return {
                            0: index === 0 ? res?.value || [] : [],
                            1: index === 1 ? res?.value || [] : [],
                            2: index === 2 ? res?.value || [] : [],
                        };
                    } catch {
                        return {
                            0: [],
                            1: [],
                            2: [],
                        };
                    }
                })
            );


            const homeworkByDay: HomeworkByDay = results.reduce(
                (acc, curr) => ({
                    0: [...acc[0], ...curr[0]],
                    1: [...acc[1], ...curr[1]],
                    2: [...acc[2], ...curr[2]],
                }),
                { 0: [], 1: [], 2: [] }
            );


            SetHomeWork(homeworkByDay);

            const dayTitles = ["Сьогодні", "Завтра", "Післязавтра"];

            const grouped = (Object.keys(homeworkByDay) as unknown as (keyof HomeworkByDay)[]).map((key) => {
                const firstHomework = homeworkByDay[key][0];
                const formattedDate = firstHomework?.AtliktiIki
                    ? formatDate(firstHomework.AtliktiIki)
                    : "";

                return {
                    title: `${dayTitles[key]}${formattedDate ? ` (${formattedDate})` : ""}`,
                    data: homeworkByDay[key],
                };
            });
            setSections(grouped);
            SetLoad(false);
            console.timeEnd("HomeWork");
        } catch (err) {
            console.error("Помилка getHomeWork:", err);
            SetLoad(false);
        }
    };

    useEffect(() => {
        getHomeWork();
    }, []);

    useFocusEffect(
        useCallback(() => {
            cardAnim.setValue(0);
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: Platform.OS !== "web",
            }).start();
        }, [])
    );

    const containsHTML = (str: string) =>
        typeof str === "string" && /<\/?[a-z][\s\S]*>/i.test(str);

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleDateString("uk-UA", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };



    const renderSectionHeader = ({ section: { title } }: any) => (
        <Animated.View
            style={[
                styles.sectionHeader,
                {
                    opacity: cardAnim,
                    transform: [
                        {
                            translateY: cardAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.line} />
        </Animated.View>
    );

    return (
        <View style={[styles.container, gstyles.back]}>
            <FullScreenModal visible={ModalVisible} onClose={() => SetModalVisible(false)}>
                <Text style={[styles.label, { color: WidgetColorText, fontSize: 28 }]}>
                    {Select?.Dalykas ?? ""}
                </Text>
                {Select?.PamokosData && (
                    <Text style={[styles.label, { color: WidgetColorText }]}>
                        Задано: {formatDate(Select.PamokosData)}
                    </Text>
                )}
                {Select?.AtliktiIki && (
                    <Text style={[styles.label, { color: WidgetColorText }]}>
                        До: {formatDate(Select.AtliktiIki)}
                    </Text>
                )}
                <View style={{ marginTop: 30 }}>
                    {Select?.UzduotiesAprasymas ? (
                        containsHTML(Select.UzduotiesAprasymas) ? (
                            <RenderHTML
                                contentWidth={400}
                                source={{ html: Select.UzduotiesAprasymas }}
                                baseStyle={{ color: WidgetColorText }}
                            />
                        ) : (
                            <Text style={{ color: WidgetColorText }}>{Select.UzduotiesAprasymas}</Text>
                        )
                    ) : (
                        <Text style={{ color: WidgetColorText }}>...</Text>
                    )}
                </View>
            </FullScreenModal>

            {Load ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#007aff" />
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item, index) => `${item.Id}_${index}`}
                    renderItem={({ item, index }) => (
                        <HomeWorkEl
                            item={item}
                            index={index}
                            cardAnim={cardAnim}
                            SetSitemect={SetSelect}
                            SetModal={SetModalVisible}
                        />
                    )}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Немає домашнього завдання 😴</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 50 : 30,
    },
    listContent: {
        paddingHorizontal: 18,
        paddingBottom: 100,
    },
    sectionHeader: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#777",
        marginBottom: 4,
    },
    line: {
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: 8,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
    },
    subject: {
        fontSize: 18,
        fontWeight: "600",
    },
    desc: {
        fontSize: 15,
        marginTop: 4,
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        fontSize: 16,
        marginTop: 40,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontWeight: "600",
        fontSize: 17,
        marginBottom: 8,
    },
});