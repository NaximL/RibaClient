import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import useMessageStore from "@store/MessageStore";
import { useMessageSendStore } from "@store/SendMessageStore";
import Head from "./components/Head";
import BottomMessageModal from "./CreateMessage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { Gstyle } from "styles/gstyles";
import FullScreenModal from "@components/Modal";
import CreateMessageScreen from './CreateMessage';
import BottomAlert from "./components/BottomAlert";
const Messages = () => {
  const { gstyles, MessageTopicText, isDark } = Gstyle();
  type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationProp>();


  const Message = useMessageStore((state) => state.Message);
  const MessageSend = useMessageSendStore((state) => state.MessageSend);
  const [AlertVal, setAlertVal] = useState(false);
  const [TextAlert, setTextAlert] = useState('');

  const [ActiveMod, setActiveMod] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);

  const [animValues, setAnimValues] = useState<Animated.Value[]>([]);
  useEffect(() => {
    setAnimValues(Message.map(() => new Animated.Value(0)));
  }, [Message]);

  useFocusEffect(
    useCallback(() => {
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

  const OpenCreateMessage = () => {
    setModalVisible(true);
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View
      style={{
        opacity: animValues[index] || 1,
        transform: [
          {
            translateY: (animValues[index] || new Animated.Value(0)).interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[styles.messageContainer, gstyles.WidgetBack]}
        onPress={() =>
          navigation.replace("FullMessage", { item: item, status: ActiveMod })
        }
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.sender,
            ActiveMod === 0
              ? !item.ArPerskaite && styles.noreed
              : item.Perskaite === 0 && styles.noreed,
          ]}
        >
          {ActiveMod === 0 ? item.Siuntejas : item.GavejoPavardeVardasTevavardis}
        </Text>
        <Text style={[styles.topic, { color: MessageTopicText }]} numberOfLines={1}>
          {item.Tema}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.date}>{new Date(item.Data).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.wrapper, gstyles.back]}>
      <Head
        setActiveMod={setActiveMod}
        ActiveMod={ActiveMod}
        onPress={OpenCreateMessage}
      />


      <FullScreenModal
        close={true}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CreateMessageScreen
          onClose={() => setModalVisible(false)}
          setAlertVal={setAlertVal}
          setTextAlert={setTextAlert}
        />
      </FullScreenModal>

      <BottomAlert
        visible={AlertVal}
        text={TextAlert}
        onHide={() => setAlertVal(false)}
      />

      <FlatList
        data={ActiveMod === 0 ? Message : MessageSend}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: Platform.OS === "ios" ? 64 : 32 },
  listContent: { paddingTop: 96, paddingHorizontal: 16, paddingBottom: 100 },
  noreed: { color: "red" },
  messageContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    elevation: 4,
  },
  sender: { fontSize: 16, fontWeight: "600", color: "#007aff", marginBottom: 4 },
  topic: { fontSize: 15, fontWeight: "500", color: "#1c1c1e", marginBottom: 8 },
  meta: { flexDirection: "row", justifyContent: "space-between" },
  date: { fontSize: 13, color: "#6e6e73" },
});