import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { getData } from '@components/LocalStorage';
import { GetMessage } from "@api/GetMessage";
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../router/router';
import { Gstyle } from "styles/gstyles";

type FileLink = {
  name: string;
  url: string;
};

const FullMessage = () => {
  const { gstyles, ChatText, ChatTitle } = Gstyle();

  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();
  const [attachments, setAttachments] = useState<FileLink[]>([]);
  const [body, setBody] = useState("");
  const { width } = useWindowDimensions();

  const route = useRoute();


  const item = route.params as {
    Id: number;
    Tema: string;
    Data: string;
    Siuntejas: string;
    Pareigos: string;
    Gavejas: string;
    Turinys: string;
  };

  useEffect(() => {
    (async () => {
      const tokens = await getData("tokens");

      if (!tokens) return
      const msg = await GetMessage(tokens, item.Id);
      setAttachments(msg.links || []);
      setBody(msg.body || "");

    })();
  }, [item.Id]);

  const handleFilePress = (url: string) => {
    Linking.openURL(url).catch(() =>
      alert("Не вдалося відкрити файл.")
    );
  };

  return (
    <ScrollView contentContainerStyle={[gstyles.back, styles.container]}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("App", { screen: "Message" })}>
        <Ionicons name="arrow-back" size={24} color="#007aff" />
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: ChatTitle }]}>{item.Tema}</Text>
      <Text style={styles.date}>{new Date(item.Data).toLocaleString()}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Від:</Text>
        <Text style={[styles.value, { color: ChatText }]}>{item.Siuntejas}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Повідомлення:</Text>
        {body ? (
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: body }}
            baseStyle={{
              ...styles.html,
              color: ChatText,
            }}
          />
        ) :
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        }
      </View>

      <View style={styles.section}>
        {attachments.length === 0 ? (
          <></>
        ) : (
          <>
            <Text style={styles.label}>Додані файли:</Text>
            {attachments.map((file, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleFilePress(file.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.name}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView >
  );
};

export default FullMessage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#007aff',
    fontSize: 16,
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222222",
  },
  date: {
    fontSize: 13,
    color: "#777777",
    marginBottom: 18,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#005bbb",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,

  },
  html: {
    fontSize: 16,

    lineHeight: 24,
  },
  noFilesText: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
  fileName: {
    color: '#007aff',
    textDecorationLine: 'underline',
    maxWidth: "95%",
    fontSize: 15,
    marginVertical: 4,
  },
});