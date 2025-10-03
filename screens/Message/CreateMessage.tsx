import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { SendMessage } from '@api/MH/SendMessage';
import { getData } from '@components/LocalStorage';
import { Gstyle } from '@styles/gstyles';
import { GetHuman } from '@api/MH/GetHuman';


type Props = {
    onClose: () => void;
    setAlertVal: (value: boolean) => void;
    setTextAlert: (text: string) => void;
};

const options = [
    { label: 'Обрати...', value: '0' },
    { label: 'Вчителі школи', value: '2' },
    { label: 'Керівництво школи', value: '8' },
    { label: 'Учні свого класу', value: '9' },
];

const CreateMessageScreen = ({ onClose, setAlertVal, setTextAlert }: Props) => {
    const { isDark, WidgetColorText } = Gstyle();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selected, setSelected] = useState(options[0]);

    const [modalVisible, setModalVisible] = useState(false);
    
    const [HumanList, setHumanList] = useState([{ label: 'start', value: 'start' }]);
    const [typeSelected, setTypeSelected] = useState(HumanList[0]);
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [load, setLoad] = useState(false);
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

    const showStatusModal = () => {
        onClose();
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
                        if (success) {
                            setTextAlert('Повідомлення надіслано!');
                            setAlertVal(true);
                            setTimeout(() => showStatusModal(), 400);
                        } else {

                            setTextAlert('Помилка при надсиланні :(');
                            setAlertVal(true);

                        }
                    });
            });
        } else {
            alert("Будь ласка, оберіть отримувача повідомлення");
        }
    };

    const SelectField = ({ label, onPress }: { label: string; onPress: () => void }) => (
        <TouchableOpacity
            style={[
                styles.select,
                { backgroundColor: isDark ? '#23232b' : '#f7f7fa', borderColor: isDark ? '#333' : '#e0e0e0' },
            ]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={[styles.selectText, { color: isDark ? '#f5f5f5' : '#222' }]} numberOfLines={1}>{label}</Text>
            <Ionicons name="chevron-down" size={18} color="#007aff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <Text style={[styles.title, { color: WidgetColorText }]}>Нове повідомлення</Text>

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
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#23232b' : '#f7f7fa',
                            borderColor: isDark ? '#333' : '#e0e0e0',
                            color: isDark ? '#f5f5f5' : '#222',
                        },
                    ]}
                    value={subject}
                    onChangeText={setSubject}
                />
                <TextInput
                    placeholder="Текст повідомлення"
                    multiline
                    placeholderTextColor={isDark ? '#888' : '#b0b0b0'}
                    style={[
                        styles.input,
                        styles.inputBody,
                        {
                            backgroundColor: isDark ? '#23232b' : '#f7f7fa',
                            borderColor: isDark ? '#333' : '#e0e0e0',
                            color: isDark ? '#f5f5f5' : '#222',
                        },
                    ]}
                    value={body}
                    onChangeText={setBody}
                />
                <Animated.View style={{ transform: [{ scale: sendAnim }], width: '100%' }}>
                    {load ? (
                        <View style={{ marginTop: 12, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#007aff" />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.sendButton} onPress={onSend} activeOpacity={0.85}>
                            <Text style={styles.sendText}>Відправити</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
                    <Text style={styles.closeText}>Закрити</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateMessageScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    title: { fontSize: 19, fontWeight: '700', marginBottom: 14, textAlign: 'center', letterSpacing: 0.1 },
    select: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        minHeight: 44,
    },
    selectText: { fontSize: 15, flex: 1, fontWeight: '500' },
    input: {
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 15,
        marginBottom:10,
        borderWidth: 1,
        minHeight: 44,
    },
    inputBody: { minHeight: 80, maxHeight: 160, textAlignVertical: 'top' },
    sendButton: {
        backgroundColor: '#007aff',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        shadowColor: '#007aff',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    sendText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    closeButton: {
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
        borderWidth: 0,
    },
    closeText: { color: '#333', fontSize: 15, fontWeight: '600' },
    liquidGlassFullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liquidGlassFullBlur: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    liquidGlassIconWrap: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: 'rgba(76,217,100,0.13)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: '#4cd964',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    liquidGlassText: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 0,
        letterSpacing: 0.1,
    },
    statusModalBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingBottom: Platform.OS === 'ios' ? 36 : 18,
        paddingTop: 24,
        alignItems: 'center',
        zIndex: 100,
        shadowColor: '#000',
        shadowOpacity: 0.13,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
        elevation: 16,
    },
    statusModalContentBottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    statusIconWrapBottom: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    statusTextBottom: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 2,
        letterSpacing: 0.1,
    },
    statusCloseBtn: {
        marginTop: 18,
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    statusCloseText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
    },
    sendingWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    sendingDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#007aff',
        marginBottom: 8,
        opacity: 0.8,
    },
});