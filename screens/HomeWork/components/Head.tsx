import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { Gstyle } from "styles/gstyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import FullScreenModal from "@components/Modal";
import useDateStore from "@store/DateStore";
import { getData } from "@components/LocalStorage";
import { fetchData } from "@api/GetAlldata";
import useHomeWorkStore from "@store/HomeWorkStore";

const formatDate = (date?: Date) =>
    date
        ? date.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "Оберіть дату";

const buildApiDate = (date: Date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const yyyy = nextDay.getFullYear();
    const mm = String(nextDay.getMonth() + 1).padStart(2, "0");
    const dd = String(nextDay.getDate() - 2).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T21:00:00+00:00`;
};

const Head = () => {
    const { isDark, MessageBubleText, WidgetColorText, gstyles } = Gstyle();
    const { Dates, setDate } = useDateStore();
    const { SetHomeWork } = useHomeWorkStore();

    const [showPicker, setShowPicker] = useState(false);

    const fetchHomework = async (date: Date) => {
        setDate(date);
        const dates = buildApiDate(date);
        const tokens = await getData("tokens");
        if (!tokens) return;

        const po = await fetchData("homework", tokens, dates);
        if (po?.value) SetHomeWork(po.value);
    };

    const onChange = (e: any) => {
        const newDate =
            Platform.OS === "web" ? new Date(e.target.value) : new Date(e.nativeEvent.timestamp);
        fetchHomework(newDate);
        setShowPicker(false);
    };

    return (
        <BlurView
            intensity={40}
            tint={isDark ? "dark" : "light"}
            style={styles.container}
        >
            {Platform.OS === "web" ? (
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text style={[styles.dateText, { color: MessageBubleText }]}>
                        {formatDate(Dates)}
                    </Text>
                </TouchableOpacity>
            ) : (
                <DateTimePicker
                    value={Dates}
                    mode="date"
                    display="compact"
                    onChange={onChange}
                />
            )}

            {showPicker && Platform.OS !== "web" && (
                <FullScreenModal onClose={() => setShowPicker(false)} visible>
                    <Pressable style={styles.closeButton} onPress={onChange}>
                        <Text style={styles.closeText}>Підтвердити</Text>
                    </Pressable>
                </FullScreenModal>
            )}

            {showPicker && Platform.OS === "web" && (
                <Modal transparent animationType="fade">
                    <View style={styles.webModal}>
                        <TouchableOpacity
                            style={styles.modalBg}
                            onPress={() => setShowPicker(false)}
                        />
                        <View style={[styles.modalContent, gstyles.WidgetBack]}>
                            <input
                                type="date"
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    fontSize: 16,
                                    ...gstyles.WidgetBack,
                                    color: WidgetColorText,
                                    borderWidth: 0,
                                }}
                                value={Dates.toISOString().split("T")[0]}
                                onChange={onChange}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </BlurView>
    );
};

export default Head;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 10,
        left: 15,
        right: 15,
        borderRadius: 18,
        overflow: "hidden",
        paddingHorizontal: 14,
        paddingVertical: 10,
        zIndex: 99,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    dateText: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        minWidth: 140,
    },
    webModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#00000066",
    },
    modalContent: {
        padding: 20,
        borderRadius: 18,
        minWidth: 250,
        alignItems: "center",
    },
    closeButton: {
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: "#007aff",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#007aff",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        width: "100%",
        alignItems: "center",
    },
    closeText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },
});