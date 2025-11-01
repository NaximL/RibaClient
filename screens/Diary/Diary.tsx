import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Animated,
  Platform,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { uk } from "date-fns/locale";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { getData, storeData } from "@components/LocalStorage";
import { GetToken } from "@api/MH_APP/GetToken";
import { ValidToken } from "@api/MH_APP/ValidToken";
import { RefreshToken } from "@api/MH_APP/RefreshToken";
import { GetDiary } from "@api/MH_APP/GetDiary";
import UseErrorStore from "@store/Error";
import ReturnElem from "@components/ReturnElement";
import SelectModal from "@screens/Message/components/SelectModal";

const systemicGradeTypeMap: Record<string, string> = {
  Notebook: "Зошит",
  Oral: "Усна відповідь",
  Simplework: "Звичайне завдання",
  Test: "Тест",
  TestWork: "Тест",
  Essay: "Твір",
  SubjectGrade: "Предметна оцінка",
  Homework: "Домашнє завдання",
  TheoreticalWork: "Теоритична робота",
  ClassWork: "Класна робота",
  PracticalWork: "Практична робота",
  "Additional test": "Додатковий тест",
  Controlwork: "Контрольна робота",
  LaboratoryWork: "Лабораторна робота",
  IndependentWork: "Самостійна робота",
  ProjectWork: "Проєктна робота",
  CreativeWork: "Творча робота",
  Moduletest: "Модульна контрольна",
  Summativeassessment: "Підсумкове оцінювання",
  Semesterassessment: "Семестрове оцінювання",
  Yearlyassessment: "Річне оцінювання",
  Thematicassessment: "Тематичне оцінювання",
  Diagnosticwork: "Діагностична робота",
  Behavior: "Поведінка",
  Other: "Інше",
  undefined: "Немає",
  null: "Немає",
};

const months: { label: string; value: string }[] = [
  { label: "січень", value: "1" },
  { label: "лютий", value: "2" },
  { label: "березень", value: "3" },
  { label: "квітень", value: "4" },
  { label: "травень", value: "5" },
  { label: "червень", value: "6" },
  { label: "липень", value: "7" },
  { label: "серпень", value: "8" },
  { label: "вересень", value: "9" },
  { label: "жовтень", value: "10" },
  { label: "листопад", value: "11" },
  { label: "грудень", value: "12" },
];

function groupByDate(data: any[]) {
  const groups: Record<string, any[]> = {};
  data.forEach((item) => {
    const date = parseISO(item.lessonCreatedOn);
    let key = "";
    if (isToday(date)) key = "Сьогодні";
    else if (isYesterday(date)) key = "Вчора";
    else key = format(date, "dd MMMM", { locale: uk });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

const Diary = () => {
  const [Diaty, SetDiary] = useState<any[]>([]);
  const [Load, SetLoad] = useState(true);
  const [typeSelected, setTypeSelected] = useState(months[new Date().getMonth()]);
  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const seterrors = UseErrorStore((state) => state.setError);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Login">>();
  const { gstyles, WidgetColorText, GlobalColor, isDark } = Gstyle();
  const anim = useRef(new Animated.Value(0)).current;

  const applyTokenData = async (token: string, studentId: string) => {
    try {
      SetLoad(true);
      const diary = await GetDiary(token, studentId, Number(typeSelected.value), 100);
      await storeData("diary", JSON.stringify(diary));
      SetDiary(diary);
      SetLoad(false);
    } catch (error) {
      console.error("Помилка при отриманні щоденника:", error);
      SetLoad(false);
    }
  };

  const handleTokenLogic = async (login: string, password: string) => {
    try {
      let tokenData = await getData("token_app");
      let tokenObj;
      if (!tokenData) {
        tokenObj = await GetToken(login, password);
        if (!tokenObj) throw new Error("Не вдалося отримати токен");
        await storeData("token_app", JSON.stringify(tokenObj));
      } else {
        tokenObj = JSON.parse(tokenData);
      }

      let valid = await ValidToken(tokenObj);
      if (!valid) {
        const newTokens = await RefreshToken(tokenObj);
        if (newTokens) {
          tokenObj = newTokens;
          valid = await ValidToken(newTokens);
          await storeData("token_app", JSON.stringify(newTokens));
        } else {
          const newData = await GetToken(login, password);
          if (!newData) throw new Error("Не вдалося оновити токен");
          tokenObj = newData;
          valid = await ValidToken(newData);
          await storeData("token_app", JSON.stringify(newData));
        }
      }

      if (valid && valid.enrollments?.[0]?.studentId) {
        await applyTokenData(tokenObj, valid.enrollments[0].studentId);
      } else {
        throw new Error("Не знайдено studentId у токені");
      }
    } catch (error: any) {
      console.error("Помилка handleTokenLogic:", error);
      seterrors({
        name: "token error",
        status: true,
        label: error.message || "Помилка при обробці токену",
      });
      navigation.navigate("Stop");
    }
  };

  const loadDiary = async () => {
    const login = await getData("login");
    const password = await getData("password");
    if (!login || !password) return;
    await handleTokenLogic(login, password);
  };

  useEffect(() => {
    loadDiary();
  }, []);

  useEffect(() => {
    loadDiary();
  }, [typeSelected]);


  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }, [])
  );

  const sections = groupByDate(Diaty);

  const renderItem = ({ item, index }: any) => {
    const gradeType =
      item.systemicGradeType === null
        ? item.nonSystemicGradeType
        : systemicGradeTypeMap[item.systemicGradeType] || "-";

    const grade =
      item.type === "Attendance"
        ? "Н"
        : item.grade === "elemNoEvaluation"
          ? "Н/О"
          : item.grade === "noEvaluation"
            ? "Н/А"
            : item.grade === "credited"
              ? "Зараховано"
              : item.grade ?? "-";

    const subject = item.subjectMatter ?? "-";

    const gradeColorDark: Record<string, string> = {
      Н: "#FF3B30",
      "Н/О": "#FF9500",
      "Н/А": "#A0A0A0",
      0: "#FF9500",
      1: "#FFCC00",
      2: "#FFD233",
      3: "#FFDD66",
      4: "#FFE599",
      5: "#F5FAD1",
      6: "#C3E57F",
      7: "#C3E57F",
      8: "#A8E65A",
      9: "#A8E65A",
      10: "#70D53B",
      11: "#70D53B",
      12: "#34C759",
    };

    const gradeColorLight: Record<string, string> = {
      Н: "#FF3B30",
      "Н/О": "#FF6F00",
      "Н/А": "#999999",
      0: "#FF6F00",
      1: "#FFB300",
      2: "#FFC233",
      3: "#FFD966",
      4: "#FFEFAA",
      5: "#FAFFD8",
      6: "#C8E37A",
      7: "#C8E37A",
      8: "#A0D755",
      9: "#A0D755",
      10: "#69C835",
      11: "#69C835",
      12: "#30C759",
    };

    const getGradeColor = (
      grade: string | number,
      theme: "dark" | "light" = "dark"
    ) => {
      const key = String(grade);
      const palette = theme === "dark" ? gradeColorLight : gradeColorDark;
      return palette[key] ?? WidgetColorText;
    };
    return (
      <Pressable onPress={() => console.log(item)}>
        <Animated.View
          key={index}
          style={[
            styles.card,
            {
              transform: [
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) },
              ],
              opacity: anim,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: WidgetColorText }]}>{subject}</Text>
              <Text style={styles.gradeType}>{gradeType}</Text>
            </View>
            <Text style={[styles.value, {
              color: getGradeColor(
                grade,
                useColorScheme() ? "dark" : "light"
              ),
            },]}>{grade}</Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Animated.View
      style={[
        styles.sectionHeader,
        {
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) },
          ],
          opacity: anim,
        },
      ]}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.line} />
    </Animated.View>
  );

  const SelectField = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity
      style={styles.select}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.selectText, { color: isDark ? "#f5f5f5" : "#222" }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, gstyles.back]}>
      <ReturnElem style={{ marginLeft: 20 }} />

      <SelectField label={typeSelected.label} onPress={() => setTypeModalVisible(true)} />

      <SelectModal
        visible={typeModalVisible}
        options={months}
        selectedValue={typeSelected.value}
        onSelect={(item) => {
          setTypeSelected(item);
          setTypeModalVisible(false);
        }}
        onClose={() => setTypeModalVisible(false)}
      />

      {Load ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={GlobalColor} />
        </View>
      ) : Diaty.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, fontWeight: "600" }}>Поки що немає оцінок 😔</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.lessonCreatedOn + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === "android" ? 50 : 32 },
  listContent: { paddingHorizontal: 18, paddingBottom: 100 },
  sectionHeader: { paddingHorizontal: 4, paddingTop: 16, paddingBottom: 6, backgroundColor: "transparent" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#777", marginBottom: 4 },
  line: { height: 1, backgroundColor: "#ccc", marginHorizontal: 8 },
  card: { borderRadius: 20, overflow: "hidden", padding: 16, backgroundColor: Platform.OS === "android" ? "" : "transparent" },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: "600", color: "#1c1c1e" },
  gradeType: { fontSize: 14, color: "#6e6e73", marginTop: 2 },
  value: { fontSize: 22, fontWeight: "700", color: "#000" },
  select: { position: "absolute", right: 20, top: 25, flexDirection: "row", alignItems: "center", padding: 10, minHeight: 37, borderRadius: 15 },
  selectText: { fontSize: 15, flex: 1, fontWeight: "500" },
});