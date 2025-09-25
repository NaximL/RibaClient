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
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import { getData } from "@components/LocalStorage";
import { GetMessage } from "@api/GetMessage";
import { GetMessageSend } from "@api/GetMessageSend";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { Gstyle } from "styles/gstyles";

type FileLink = { name: string; url: string };

const FullMessage = () => {
  const { gstyles, ChatText, ChatTitle } = Gstyle();
  type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationProp>();

  const { width } = useWindowDimensions();
  const route = useRoute();
  const { item, status } = route.params as any;

  const [attachments, setAttachments] = useState<FileLink[]>([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    (async () => {
      const tokens = await getData("tokens");
      if (!tokens) return;

      const fetcher = status === 0 ? GetMessage : GetMessageSend;
      const msg = await fetcher(tokens, item.Id);
      setAttachments(msg.links || []);
      setBody(msg.body || "");
    })();
  }, [item.Id]);

  function autoLinkify(html: string) {
    if (!html) return "";

    return html.replace(
      /(https?:\/\/[^\s<]+)/g,
      (match, url, offset, full) => {

        const before = full.slice(0, offset);
        const after = full.slice(offset + match.length);


        const isInsideLink =
          before.lastIndexOf("<a") > before.lastIndexOf("</a>");

        if (isInsideLink) {
          return match;
        }

        return `<a href="${match}">${match}</a>`;
      }
    );
  }

  return (
    <ScrollView contentContainerStyle={[gstyles.back, styles.container]}>

      {Platform.OS !== "ios" &&
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("App", { screen: "Message" })}
        >
          <Ionicons name="arrow-back" size={24} color="#007aff" />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
      }

      <Text style={[styles.title, { color: ChatTitle }]}>{item.Tema}</Text>
      <Text style={styles.date}>{new Date(item.Data).toLocaleString()}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{status === 0 ? "Від" : "Кому"}:</Text>
        <Text style={[styles.value, { color: ChatText }]}>
          {status === 0 ? item.Siuntejas : item.GavejoPavardeVardasTevavardis}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Повідомлення:</Text>
        {body ? (
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: autoLinkify(body) }}
            defaultTextProps={{
              selectable: true,
            }}
            baseStyle={{ ...styles.html, color: ChatText }}
            tagsStyles={{
              span: {
                borderRadius: 4,
                paddingHorizontal: 4,
                paddingVertical: 2,
                backgroundColor: 'white',
                color: "black",
              },
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 40 }} />
        )}
      </View>

      {attachments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Додані файли:</Text>
          {attachments.map((file, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(file.url)}
              activeOpacity={0.7}
            >
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default FullMessage;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: Platform.OS === "ios" ? 32 : Platform.OS === "android" ? 50 : 32 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: "#007aff", fontSize: 16, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  date: { fontSize: 13, color: "#777", marginBottom: 18 },
  section: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", color: "#005bbb", marginBottom: 8 },
  value: { fontSize: 16 },
  html: { fontSize: 16, lineHeight: 24 },
  fileName: { color: "#007aff", textDecorationLine: "underline", fontSize: 15, marginVertical: 4 },
});