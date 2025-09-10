import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, FlatList, StyleSheet, Text, useWindowDimensions, View, Animated, Platform } from 'react-native';
import RenderHTML from 'react-native-render-html';
import FullScreenModal from '../../components/Modal';
import useHomeWorkStore from '../../store/HomeWorkStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Gstyle } from 'styles/gstyles';
import HomeWorkEl from './components/HomeWorkEl';

interface HomeworkItem {
    Id: string;
    Dalykas?: string;
    MokytojoVardasPavarde?: string;
    AtliktiIki?: string;
    PamokosData?: string;
    UzduotiesAprasymas?: string;
    [key: string]: string | undefined;
}

export default function HomeWork() {
    const { gstyles, WidgetColorText } = Gstyle();

    function rem(arr: Array<HomeworkItem>, key: string) {
        const seen = new Set();
        return arr.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    const [List, SetList] = useState<HomeworkItem[]>([]);
    const [Select, SetSelect] = useState<HomeworkItem | null>(null);
    const { width } = useWindowDimensions();

    const HomeWork = useHomeWorkStore((state) => state.HomeWork);
    const [cardAnim] = useState(useRef(new Animated.Value(0)).current);
    useFocusEffect(
        useCallback(() => {
            cardAnim.setValue(0);
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: Platform.OS !== 'web',
            }).start();
        }, [])
    );

    useEffect(() => {
        Animated.timing(cardAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
        const d = rem(HomeWork, 'UzduotiesAprasymas');
        SetList(d);
        console.log(HomeWork)

    }, [HomeWork]);

    const containsHTML = (str: string) => typeof str === 'string' && /<\/?[a-z][\s\S]*>/i.test(str);
    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };


    return (
        <>
            <View style={[styles.container, gstyles.back]}>
                <FullScreenModal onClose={() => SetSelect(null)} visible={!!Select}>
                    <Text style={[styles.label, { color: WidgetColorText, fontSize: 30 }]}>{Select?.Dalykas ?? ''}</Text>
                    <Text style={[styles.label, { color: WidgetColorText }]}>{Select?.PamokosData ? `Задано: ${formatDate(Select.PamokosData)}` : ''}</Text>
                    <Text style={[styles.label, { color: WidgetColorText }]}>{Select?.AtliktiIki ? `Дата здачі: ${formatDate(Select.AtliktiIki)}` : ''}</Text>
                    <Text style={{ color: WidgetColorText, fontSize: 15, marginTop: 30 }}>
                        {Select?.UzduotiesAprasymas
                            ? containsHTML(Select.UzduotiesAprasymas)
                                ? <RenderHTML
                                    contentWidth={width}
                                    source={{ html: Select.UzduotiesAprasymas }}
                                    baseStyle={{ ...styles.value, color: WidgetColorText }}
                                    ignoredDomTags={['o:p']}
                                />
                                : Select.UzduotiesAprasymas
                            : '...'}
                    </Text>
                </FullScreenModal>

                <ScrollView
                    style={{ paddingBottom: 65 }}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >

                    {List.length === 0 ? <Animated.View
                        style={{
                            opacity: cardAnim,
                            transform: [
                                { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                                { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }
                            ]
                        }}
                    >
                        <Text style={styles.emptyText}>Наразі немає домашнього завдання</Text>

                    </Animated.View> :
                        <FlatList
                            data={List}
                            renderItem={({ item, index }) => (
                                <HomeWorkEl item={item} index={index} cardAnim={cardAnim} SetSitemect={SetSelect} />
                            )}
                            keyExtractor={(item) => item.Id.toString()}
                            showsVerticalScrollIndicator={false}
                        />

                    }
                </ScrollView>
            </View>
            <StatusBar style="dark" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(247, 247, 250)',
        paddingVertical: Platform.OS === 'ios' || Platform.OS === 'android' ? 50 : 0,

    },
    contentContainer: {
        padding: 18,
    },
    card: {

        borderRadius: 18,
        padding: 20,
        marginBottom: 14,

        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        elevation: 2,
    },
    label: {
        fontWeight: '600',
        fontSize: 17,
        marginBottom: 8,

    },
    value: {
        fontSize: 15,
        color: '#444',
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#aaa",
        fontSize: 16,
    },
});