import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import useMessageStore from "@store/MessageStore";
import Head from "./components/Head";
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../router';
import { useNavigation } from '@react-navigation/native';
import FullScreenModal from '@components/Modal';

const ChoiceChat = () => {
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();

  const Message = useMessageStore((state) => state.Message);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация сообщений по поисковому запросу
  const filteredMessages = Message.filter((msg) =>
    msg.Tema.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.Siuntejas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => navigation.replace("FullMessage", item)}
      activeOpacity={0.8}
    >
      <Text style={[styles.sender, !item.ArPerskaite && styles.noreed]}>
        {item.Siuntejas}
      </Text>
      <Text style={styles.topic} numberOfLines={1}>
        {item.Tema}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.date}>{new Date(item.Data).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headWrapper}>
        <Head modal={setModalVisible} nav={navigation} />
      </View>



      <FullScreenModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Пошук повідомлень..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            clearButtonMode="while-editing"
          />

          {filteredMessages.length === 0 ? (
            <Text style={styles.noResults}>Нічого не знайдено</Text>
          ) : (
            <FlatList
              data={filteredMessages}
              keyExtractor={(item) => item.Id.toString()}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </FullScreenModal>

      <FlatList
        data={Message} 
        renderItem={renderItem}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChoiceChat;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f2f4f8",
    paddingTop: Platform.OS === "ios" ? 64 : 32,
  },

  headWrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 64 : 16,
    left: 16,
    right: 16,
    zIndex: 99,
  },

  listContent: {
    paddingTop: 96,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  noreed: {
    color: "red",
  },

  messageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },

  sender: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007aff",
    marginBottom: 4,
  },

  topic: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1c1c1e",
    marginBottom: 8,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  receiver: {
    fontSize: 13,
    color: "#6e6e73",
  },

  date: {
    fontSize: 13,
    color: "#6e6e73",
  },



  modalContent: {
    flex: 1,
  },

  searchInput: {
    height: 48,
    borderColor: "#007aff",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#222",
  },

  noResults: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
});