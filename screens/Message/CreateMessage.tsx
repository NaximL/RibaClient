import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectModal from './components/SelectModal';
import { SendMessage } from '@api/SendMessage';
import { getData } from '@components/LocalStorage';
import { Gstyle } from 'styles/gstyles';
import BottomAlert from './components/BottomAlert';
import { GetHuman } from '@api/GetHuman';

type Props = {
    onClose: () => void;
};

const options = [
    { label: 'Обрати...', value: '0'},
    { label: 'Вчителі школи', value: '2' },
    { label: 'Керівництво школи', value: '8' },
    { label: 'Учні свого класу', value: '9' },
];

const CreateMessageScreen = ({ onClose }: Props) => {
    const { isDark, WidgetColorText } = Gstyle();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selected, setSelected] = useState(options[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [HumanList, setHumanList] = useState([{ label: 'start', value: 'start' }]);
    const [typeSelected, setTypeSelected] = useState(HumanList[0]);
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [load, setLoad] = useState(false);
    const [alerts, setAlerts] = useState(false);
    const [TextAlert, setTextAlert] = useState('Повідомлення надіслано!');
    const [sendAnim] = useState(new Animated.Value(1));

    const ChoiceHuman = async (item: any) => {
        const tokens = await getData('tokens');
        if (!tokens) return;
        await GetHuman(tokens, item.value).then(data => {
            setHumanList(data);
            setTypeSelected(data[0]);
        });
        setSelected(item);
        setModalVisible(false);
    };

    const onSend = async () => {
        const tokens = await getData('tokens');
        if (!tokens) return;

        if (!subject.trim()) { alert('Введіть тему'); return; }
        if (!body.trim()) { alert('Введіть текст повідомлення'); return; }

        
        if (typeSelected.label != 'start' && selected.label != 'Обрати...' && typeSelected.label != 'Обрати...') {
            Animated.sequence([
                Animated.timing(sendAnim, { toValue: 0.9, duration: 80, useNativeDriver: Platform.OS !== 'web' }),
                Animated.timing(sendAnim, { toValue: 1, duration: 80, useNativeDriver: Platform.OS !== 'web' }),
            ]).start(async () => {
                setLoad(true);
                await SendMessage(tokens, typeSelected, HumanList, selected.value, body, subject)
                    .then(success => {
                        setLoad(false);
                        if (success) setAlerts(true);
                        else {
                            setTextAlert('Помилка при надсиланні :(');
                            setAlerts(true);
                        }
                    });
            });
        }
        else {
            alert("Будь ласка, оберіть отримувача повідомлення");
        }
    };

    const SelectField = ({ label, onPress }: { label: string; onPress: () => void }) => (
        <TouchableOpacity
            style={[
                styles.select,
                { backgroundColor: isDark ? '#1c1c1e' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' },
            ]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={[styles.selectText, { color: isDark ? '#f5f5f5' : '#222' }]}>{label}</Text>
            <Ionicons name="chevron-down" size={18} color="#007aff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={[styles.title, { color: WidgetColorText }]}>Написати повідомлення</Text>

                <SelectField label={selected.label} onPress={() => setModalVisible(true)} />
                <SelectModal visible={modalVisible} options={options} selectedValue={selected.value} onSelect={ChoiceHuman} onClose={() => setModalVisible(false)} />

                {selected.label !== 'Обрати...' && (
                    <>
                        <SelectField label={typeSelected.label} onPress={() => setTypeModalVisible(true)} />
                        <SelectModal visible={typeModalVisible} options={HumanList} selectedValue={typeSelected.value} onSelect={(item) => { setTypeSelected(item); setTypeModalVisible(false); }} onClose={() => setTypeModalVisible(false)} />
                    </>
                )}

                <TextInput
                    placeholder="Тема"
                    placeholderTextColor={isDark ? '#888' : '#b0b0b0'}
                    style={[styles.input, { backgroundColor: isDark ? '#1c1c1e' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0', color: isDark ? '#f5f5f5' : '#222' }]}
                    value={subject}
                    onChangeText={setSubject}
                />

                <TextInput
                    placeholder="Текст повідомлення"
                    multiline
                    placeholderTextColor={isDark ? '#888' : '#b0b0b0'}
                    style={[styles.input, styles.inputBody, { backgroundColor: isDark ? '#1c1c1e' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0', color: isDark ? '#f5f5f5' : '#222' }]}
                    value={body}
                    onChangeText={setBody}
                />

                <Animated.View style={{ transform: [{ scale: sendAnim }], width: '100%' }}>
                    {load ? (
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#007aff" />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.sendButton} onPress={onSend} activeOpacity={0.85}>
                            <Text style={styles.sendText}>Відправити</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
                {!load &&
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
                        <Text style={styles.closeText}>Закрити</Text>
                    </TouchableOpacity>
                }
                <BottomAlert visible={alerts} onHide={() => setAlerts(false)} text={TextAlert} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateMessageScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
    select: { width: '100%', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
    selectText: { fontSize: 16, flex: 1, fontWeight: '500' },
    input: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, marginBottom: 14, borderWidth: 1 },
    inputBody: { minHeight: 120, maxHeight: 200, textAlignVertical: 'top' },
    sendButton: { backgroundColor: '#007aff', borderRadius: 18, paddingVertical: 14, alignItems: 'center', marginTop: 16, width: '100%' },
    sendText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    closeButton: { backgroundColor: '#f2f2f2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 12, width: '100%' },
    closeText: { color: '#333', fontSize: 16, fontWeight: '600' },
});