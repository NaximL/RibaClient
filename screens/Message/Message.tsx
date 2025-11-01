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
import { GetMessage } from "@api/MH/GetMessage";
import { GetMessageSend } from "@api/MH/GetMessageSend";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { Gstyle } from "@styles/gstyles";
import ReturnElem from "@components/ReturnElement";

type FileLink = { name: string; url: string };

const FullMessage = () => {
  const { gstyles, ChatText, ChatTitle, GlobalColor, WidgetColorText } = Gstyle();
  type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationProp>();
  const [Load, SetLoad] = useState(true);
  const { width } = useWindowDimensions();
  const route = useRoute();
  const { id, status } = route.params as any;
  const [Message, SetMessage] = useState({
    tema: "(Немає)",
    siuntejas: "(Немає)",
    data: "(Не визначено)",
    body: "<b>(Немає)<b/>",
    links: []
  });
  const [attachments, setAttachments] = useState<FileLink[]>([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    (async () => {
      const tokens = await getData("tokens");
      if (!tokens) return;

      const fetcher = status === 0 ? GetMessage : GetMessageSend;
      const msg = await fetcher(tokens, id);
      SetMessage(msg);
      console.log(msg)
      setAttachments(msg.links || []);
      setBody(msg.body || "");
      SetLoad(false);
    })();
  }, [id]);

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

  function parseUaDate(uaDateStr: string) {
    if (!uaDateStr) return '';
    const [datePart, timePart] = uaDateStr.split(' ');
    if (!datePart || !timePart) return uaDateStr;
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return (

    <ScrollView contentContainerStyle={[gstyles.back, styles.container]}>
      {Load ?
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={GlobalColor} />
        </View>
        :
        <>

          <ReturnElem style={{ right: 5 }} url={"Message"} />


          <Text style={[styles.title, { color: ChatTitle }]}>{Message.tema}</Text>
          <Text style={styles.date}>{parseUaDate(Message.data)}</Text>

          <View style={styles.section}>
            <Text style={[styles.label, , { color: GlobalColor }]}>{status === 0 ? "Від" : "Кому"}:</Text>
            <Text style={[styles.value, { color: ChatText }]}>
              {Message.siuntejas}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: GlobalColor }]}>Повідомлення:</Text>
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
              <ActivityIndicator size="large" color={GlobalColor} style={{ marginTop: 40 }} />
            )}
          </View>

          {attachments.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: WidgetColorText }]}>Додані файли:</Text>
              {attachments.map((file, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => Linking.openURL(file.url)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.fileName, { color: GlobalColor }]} numberOfLines={1}>
                    {file.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      }
    </ScrollView>
  );
};

export default FullMessage;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: Platform.OS === "ios" ? 32 : Platform.OS === "android" ? 50 : 32 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  date: { fontSize: 13, color: "#777", marginBottom: 18 },
  section: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8 },
  value: { fontSize: 16 },
  html: { fontSize: 16, lineHeight: 24 },
  fileName: { textDecorationLine: "underline", fontSize: 15, marginVertical: 4 },
});