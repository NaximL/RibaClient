import React, { useRef } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Animated,
    Platform,
    TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { Gstyle } from "@styles/gstyles";
import ReturnElem from "@components/ReturnElement";

type TeacherItem = {
    urok: string;
    teach: string;
};

const Teachers = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { gstyles, WidgetColorText, isDark, GlobalColor } = Gstyle();

    // console.log(les && JSON.parse(les).u)

    const teachers: TeacherItem[] = [
        { urok: "Зарубіжна література", teach: "Шанаєва О.В." },
        { urok: "Інформатика", teach: "Бондар С.О." },
        { urok: "Математика", teach: "Ковальчук О.П." },
        { urok: "Українська мова", teach: "Шевченко І.В." },
        { urok: "Фізика", teach: "Григоренко П.М." },
    ];

    const animValues = useRef(teachers.map(() => new Animated.Value(0))).current;

    useFocusEffect(
        React.useCallback(() => {
            animValues.forEach((anim, index) => {
                anim.setValue(0);
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 400 + index * 100,
                    useNativeDriver: Platform.OS !== "web",
                }).start();
            });
        }, [animValues])
    );

    const renderItem = ({ item, index }: { item: TeacherItem; index: number }) => (
        <Animated.View
            style={[
                styles.card,
                { backgroundColor: isDark ? "#1C1C1E" : "#fff" },
                {
                    opacity: animValues[index],
                    transform: [
                        {
                            translateY: animValues[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            }),
                        },
                        {
                            scale: animValues[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.96, 1],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={[styles.iconCircle, { backgroundColor: isDark ? "#33333a" : "#f2f2f7" }]}>
                <Text style={styles.iconText}>👩‍🏫</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.subject, { color: WidgetColorText }]}>{item.urok}</Text>
                <Text style={[styles.teacherName, { color: isDark ? "#ccc" : "#555" }]}>
                    {item.teach}
                </Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={[styles.container, gstyles.back]}>
            <ReturnElem style={{ right: 5 }} />
            <FlatList
                data={teachers}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Teachers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 50 : 32,
        paddingHorizontal: 18,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backText: {
        fontSize: 16,
        marginLeft: 6,
        fontWeight: "500",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    iconText: {
        fontSize: 22,
    },
    subject: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 4,
    },
    teacherName: {
        fontSize: 15,
    },
});