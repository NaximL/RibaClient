import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    Animated,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../router/router';
import { GetHuman } from '@api/GetHuman';
import { getData } from '@components/LocalStorage';
import SelectModal from './components/SelectModal'
import { SendMessage } from '@api/SendMessage';
import BottomAlert from './components/BottomAlert';
import { Gstyle } from 'styles/gstyles';

const options = [
    { label: 'Обрати...', value: '0' },
    { label: 'Вчителі школи', value: '2' },
    { label: 'Керівництво школи', value: '8' },
    { label: 'Учні свого класу', value: '9' },
];

const CreateMessageScreen = () => {
    type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<NavigationProp>();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const { gstyles, WidgetColorText } = Gstyle()
    const [sendAnim] = useState(new Animated.Value(1));

    const [load, setload] = useState(false);

    const [alerts, setalerts] = useState(false);
    const [TextAlert, setTextAlert] = useState('Повідомлення надіслано!');


    const [HumanList, setHumanList] = useState([{ label: 'start', value: 'start' }]);

    const [selected, setSelected] = useState(options[0]);
    const [modalVisible, setModalVisible] = useState(false);

    const [typeSelected, setTypeSelected] = useState(HumanList[0]);
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const ChoiceHuman = async (item: any) => {
        const tokens = await getData("tokens");
        if (!tokens) return;
        await GetHuman(tokens, item.value).then(data => {

            setHumanList(data);
            setTypeSelected(data[0]);
        });
        setSelected(item);
        setModalVisible(false);
    };

    const onSend = async () => {
        const tokens = await getData("tokens");
        if (!tokens) return;

        if (!subject.trim()) {
            alert('Будь ласка, введіть Тему');
            return;
        }
        if (!body.trim()) {
            alert('Будь ласка, введіть Тіло повідомлення');
            return;
        }

        if (typeSelected.label != "Обрати..." || selected.label != "Обрати...") {

            Animated.sequence([
                Animated.timing(sendAnim, { toValue: 0.8, duration: 80, useNativeDriver: true }),
                Animated.timing(sendAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
            ]).start(async () => {

                setload(true);
                await SendMessage(
                    tokens,
                    typeSelected,
                    HumanList,
                    selected.value,
                    body,
                    subject
                )
                    .then(data => {
                        console.log(data)
                        if (data) {
                            setload(false);
                            setalerts(true);
                        }
                        else {
                            setTextAlert("Помилка при надсилані :(");
                            setalerts(true);
                        }
                    })



            });

        }

    };

    return (

        <SafeAreaView style={[styles.safe, gstyles.back]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >


                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("App", { screen: "Message" })}>
                    <Ionicons name="arrow-back" size={24} color="#007aff" />
                    <Text style={styles.backText}>Назад</Text>
                </TouchableOpacity>

                <View style={styles.centeredContent}>
                    <Text style={[styles.title, { color: WidgetColorText }]}>Написати повідомлення</Text>

                    {/* Перше випадаюче меню */}
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.selectText}>{selected.label}</Text>
                        <Ionicons name="chevron-down" size={18} color="#007aff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <SelectModal
                        visible={modalVisible}
                        options={options}
                        selectedValue={selected.value}
                        onSelect={ChoiceHuman}
                        onClose={() => setModalVisible(false)}
                    />

                    {selected.label != "Обрати..." && (
                        <>
                            <TouchableOpacity
                                style={styles.select}
                                onPress={() => setTypeModalVisible(true)}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.selectText}>{typeSelected.label}</Text>
                                <Ionicons name="chevron-down" size={18} color="#007aff" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>

                            <SelectModal
                                visible={typeModalVisible}
                                options={HumanList}
                                selectedValue={typeSelected.value}
                                onSelect={(item) => {


                                    setTypeSelected(item);
                                    setTypeModalVisible(false);
                                }}
                                onClose={() => setTypeModalVisible(false)}
                            />
                        </>
                    )}

                    <TextInput
                        placeholder="Тема"
                        style={styles.input}
                        placeholderTextColor="#b0b0b0"
                        value={subject}
                        onChangeText={setSubject}
                        maxLength={60}
                    />
                    <TextInput
                        placeholder="Текст повідомлення"
                        multiline
                        style={[styles.input, styles.inputBody]}
                        placeholderTextColor="#b0b0b0"
                        value={body}
                        onChangeText={setBody}
                        maxLength={1000}
                    />

                    <Animated.View style={{ transform: [{ scale: sendAnim }], width: '100%' }}>
                        {load ?
                            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
                                <ActivityIndicator size="large" color="#007aff" />
                            </View>
                            :

                            <TouchableOpacity style={styles.sendButton} onPress={onSend} activeOpacity={0.85}>
                                <Text style={styles.sendText}>Відправити</Text>
                            </TouchableOpacity>
                        }

                    </Animated.View>

                </View>
            </KeyboardAvoidingView>
            <BottomAlert
                visible={alerts}
                onHide={() => { }}
                text={TextAlert} />

        </SafeAreaView>

    );
};

export default CreateMessageScreen;
const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 10,
    },
    backText: {
        color: '#007aff',
        fontSize: 16,
        marginLeft: 6,
        fontWeight: '500',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    select: {
        width: '100%',
        backgroundColor: 'rgb(255,255,255)',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
    },
    selectText: {
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
        color: '#222',
    },
    input: {
        backgroundColor: 'rgb(255,255,255)',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 14,
        color: '#222',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
    },
    inputBody: {
        minHeight: 120,
        maxHeight: 200,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: '#007aff',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
        shadowColor: '#007aff',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
    },
    sendText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});