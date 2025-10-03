import React, { useRef, useCallback } from "react";
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    Animated,
    Platform,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Gstyle } from "@styles/gstyles";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { patchNotes } from "@config/config";

type PatchNoteItem = {
    text: string;
};

export type PatchNoteSection = {
    version: string;
    data: PatchNoteItem[];
};



const PatchNotesScreen = () => {
    const anim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { gstyles,WidgetColorText } = Gstyle();
    useFocusEffect(
        useCallback(() => {
            anim.setValue(0);
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: Platform.OS !== "web",
            }).start();
        }, [])
    );

    const renderItem = ({ item }: { item: PatchNoteItem }) => (
        <View style={styles.card}>
            <Text style={[styles.cardText,{color:WidgetColorText}]}>{item.text}</Text>
        </View>
    );

    const renderSectionHeader = ({ section: { version } }: any) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Версія {version}</Text>
            <View style={styles.line} />
        </View>
    );

    return (
        <View style={[styles.container, gstyles.back]}>
            {Platform.OS !== "ios" && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#007aff" />
                    <Text style={styles.backText}>Назад</Text>
                </TouchableOpacity>
            )}

            <Animated.View style={{
                flex: 1, opacity: anim, transform: [{
                    translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] })
                }]
            }}>
                <SectionList
                    sections={patchNotes}
                    keyExtractor={(item, index) => item.text + index}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        </View>
    );
};

export default PatchNotesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 50 : 32,
    },
    listContent: {
        paddingHorizontal: 18,
        paddingBottom: 100,
    },
    sectionHeader: {
        paddingHorizontal: 4,
        paddingTop: 16,
        paddingBottom: 6,
        backgroundColor: "transparent",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#007aff",
        marginBottom: 4,

    },
    line: {
        height: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 8,
    },
    card: {
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        // backgroundColor: 
        // shadowColor: "#000",
        // shadowOpacity: 0.05,
        // shadowRadius: 6,
        // elevation: 2,
    },
    cardText: {
        fontSize: 15,
        
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        marginLeft: 20,
    },
    backText: {
        color: "#007aff",
        fontSize: 16,
        marginLeft: 6,
    },
});