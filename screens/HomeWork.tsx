import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Pressable, StyleSheet, Text, useWindowDimensions, View, Animated, Platform} from 'react-native';
import RenderHTML from 'react-native-render-html';
import FullScreenModal from '../components/Modal';
import useHomeWorkStore from '../store/HomeWorkStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface HomeworkItem {
    Dalykas?: string;
    MokytojoVardasPavarde?: string;
    AtliktiIki?: string;
    PamokosData?: string;
    UzduotiesAprasymas?: string;
    [key: string]: string | undefined;
}

export default function HomeWork() {
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

    const exemple: HomeworkItem = {
        Dalykas: undefined,
        MokytojoVardasPavarde: undefined,
        AtliktiIki: undefined,
        PamokosData: undefined,
        UzduotiesAprasymas: undefined,
    };
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
                useNativeDriver: true,
            }).start();
        }, [])
    );

    useEffect(() => {
        Animated.timing(cardAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
        }).start();
        const d = rem(HomeWork, 'UzduotiesAprasymas');
        SetList(d);
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
            <View style={[styles.container, { backgroundColor: '#f7f7fa' }]}>
                <FullScreenModal onClose={() => SetSelect(null)} visible={!!Select}>
                    <Text style={[styles.label, { fontSize: 30 }]}>{Select?.Dalykas ?? ''}</Text>
                    <Text style={styles.label}>{Select?.PamokosData ? `Задано: ${formatDate(Select.PamokosData)}` : ''}</Text>
                    <Text style={styles.label}>{Select?.AtliktiIki ? `Кінцева дата здачі: ${formatDate(Select.AtliktiIki)}` : ''}</Text>
                    <Text style={{ fontSize: 15, marginTop: 30 }}>
                        {Select?.UzduotiesAprasymas
                            ? containsHTML(Select.UzduotiesAprasymas)
                                ? <RenderHTML
                                    contentWidth={width}
                                    source={{ html: Select.UzduotiesAprasymas }}
                                    baseStyle={styles.value}
                                    ignoredDomTags={['o:p']}
                                />
                                : Select.UzduotiesAprasymas
                            : '...'}
                    </Text>
                </FullScreenModal>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {List.map((el, index) => (
                        <Animated.View
                            key={index}
                            style={{
                                ...styles.card,
                                opacity: cardAnim,
                                transform: [ 
                                    { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                                    { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }
                                ]
                            }}
                        >
                            <Pressable onPress={() => {
                                SetSelect(el); 
                            }}>
                                <Text style={styles.label}>{el.Dalykas ?? ''}</Text>
                                {el.UzduotiesAprasymas && containsHTML(el.UzduotiesAprasymas) ? (
                                    <RenderHTML
                                        contentWidth={width}
                                        source={{ html: el.UzduotiesAprasymas }}
                                        baseStyle={styles.value}
                                        ignoredDomTags={['o:p']}
                                    />
                                ) : (
                                    <Text style={styles.value}>{el.UzduotiesAprasymas ?? '...'}</Text>
                                )}
                            </Pressable>
                        </Animated.View>
                    ))}
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
        paddingBottom: 65
    },
    contentContainer: {
        padding: 18,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    label: {
        fontWeight: '600',
        fontSize: 17,
        marginBottom: 8,
        color: '#222',
    },
    value: {
        fontSize: 15,
        color: '#444',
    },
});
