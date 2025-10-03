import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
    FlatList,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    Animated,
    Platform,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
} from "react-native";
import RenderHTML from "react-native-render-html";
import FullScreenModal from "../../components/Modal";
import useHomeWorkStore from "../../store/HomeWorkStore";
import { useFocusEffect } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";
import HomeWorkEl from "./components/HomeWorkEl";
import Head from "./components/Head";
import { getData } from "@components/LocalStorage";
import { fetchData } from "@api/MH/GetAlldata";
import useDateStore from "@store/DateStore";

interface HomeworkItem {
    Id: string;
    Dalykas?: string;
    MokytojoVardasPavarde?: string;
    AtliktiIki?: string;
    PamokosData?: string;
    Failai: Array<any> | null;
    UzduotiesAprasymas?: string;
    [key: string]: string | Array<any> | null | undefined;
}
type FileLink = { Id: string; Pavadinimas: string };
export default function HomeWork() {
    const { gstyles, WidgetColorText } = Gstyle();

    const rem = (arr: HomeworkItem[], key: string) => {
        const seen = new Set();
        return arr.filter((item) => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    };

    const [List, SetList] = useState<HomeworkItem[]>([]);
    const [Load, SetLoad] = useState<boolean>(true);
    const [attachments, setAttachments] = useState<FileLink[]>([]);

    const [Select, SetSelect] = useState<HomeworkItem | null>(null);
    const { width } = useWindowDimensions();
    const { setDate } = useDateStore();

    const { HomeWork, SetHomeWork } = useHomeWorkStore();

    const [cardAnim] = useState(new Animated.Value(0));

    useFocusEffect(
        useCallback(() => {
            cardAnim.setValue(0);
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: Platform.OS !== "web",
            }).start();
        }, [cardAnim])
    );

    const getHomeWork = async () => {
        console.time("HomeWork")
        const tokens = await getData("tokens")
        if (!tokens) return;

        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 1);


        setDate(dateObj);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const date = `${yyyy}-${mm}-${dd}T21:00:00+00:00`;
        console.log(date)


        const HomeWork = await fetchData("homework", tokens, date)
        // Failai
        // console.log(HomeWork)
        SetHomeWork(HomeWork.value);
        SetLoad(false);
        console.timeEnd("HomeWork")
    }

    useEffect(() => {
        SetList(rem(HomeWork, "UzduotiesAprasymas"));
    }, [HomeWork]);



    useEffect(() => {
        getHomeWork();
        Animated.timing(cardAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: Platform.OS !== "web",
        }).start();
        SetList(rem(HomeWork, "UzduotiesAprasymas"));
    }, []);

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

    const tagsStyles = useMemo(
        () => ({
            span: {
                borderRadius: 4,
                paddingHorizontal: 4,
                paddingVertical: 2,
                backgroundColor: "white",
                color: "black",
            },
        }),
        []
    );

    return (
        <>
            <View style={[styles.container, gstyles.back]}>

                <FullScreenModal onClose={() => SetSelect(null)} visible={!!Select}>
                    <Text style={[styles.label, { color: WidgetColorText, fontSize: 30 }]}>
                        {Select?.Dalykas ?? ""}
                    </Text>
                    <Text style={[styles.label, { color: WidgetColorText }]}>
                        {Select?.PamokosData
                            ? `Задано: ${formatDate(Select.PamokosData)}`
                            : ""}
                    </Text>
                    <Text style={[styles.label, { color: WidgetColorText }]}>
                        {Select?.AtliktiIki
                            ? `Дата здачі: ${formatDate(Select.AtliktiIki)}`
                            : ""}
                    </Text>
                    <View style={{ marginTop: 30 }}>
                        {Select?.UzduotiesAprasymas ? (
                            containsHTML(Select.UzduotiesAprasymas) ? (
                                <RenderHTML
                                    contentWidth={width}
                                    source={{ html: Select.UzduotiesAprasymas }}
                                    baseStyle={{ ...styles.value, color: WidgetColorText }}
                                    ignoredDomTags={["o:p"]}
                                    defaultTextProps={{
                                        selectable: true,
                                    }}
                                    tagsStyles={tagsStyles}
                                />
                            ) : (
                                <Text style={{ color: WidgetColorText, fontSize: 15 }}>
                                    {Select.UzduotiesAprasymas}
                                </Text>
                            )
                        ) : (
                            <Text style={{ color: WidgetColorText }}>...</Text>
                        )}
                        {Select?.Failai && Select.Failai.length > 0 && (
                            <View style={styles.section}>
                                <Text style={[styles.label, { color: WidgetColorText }]}>Додані файли:</Text>
                                {Select.Failai.map((file, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => Linking.openURL(`https://app.moiashkola.ua/Pamoka/Siustis/${file.Id}`)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.fileName} numberOfLines={1}>
                                            {file.Pavadinimas}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>)}

                    </View>
                </FullScreenModal>
                <Head />


                {Load ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#007aff" />
                    </View> :
                    <FlatList
                        data={List}
                        keyExtractor={(item) => item.Id.toString()}
                        renderItem={({ item, index }) => (
                            <HomeWorkEl
                                item={item}
                                index={index}
                                cardAnim={cardAnim}
                                SetSitemect={SetSelect}
                            />
                        )}

                        ListEmptyComponent={
                            <Animated.View
                                style={{
                                    opacity: cardAnim,
                                    transform: [
                                        {
                                            scale: cardAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.95, 1],
                                            }),
                                        },
                                        {
                                            translateY: cardAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [30, 0],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <Text style={styles.emptyText}>
                                    Наразі немає домашнього завдання
                                </Text>
                            </Animated.View>
                        }
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    />
                }

            </View>
            <StatusBar style="dark" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(247, 247, 250)",
        paddingVertical: Platform.OS === "ios" || Platform.OS === "android" ? 50 : 0,
    },
    contentContainer: {
        padding: 18,
        paddingBottom: 65,
        paddingTop: 55,
    },
    card: {
        borderRadius: 18,
        padding: 20,
        marginBottom: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        elevation: 2,
    },
    label: {
        fontWeight: "600",
        fontSize: 17,
        marginBottom: 8,
    },
    value: {
        fontSize: 15,
        color: "#444",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#aaa",
        fontSize: 16,
    },
    fileName: { color: "#007aff", textDecorationLine: "underline", fontSize: 15, marginVertical: 4 },
    section: { marginTop: 24 },
});