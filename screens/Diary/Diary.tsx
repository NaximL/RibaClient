import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { uk } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router/router";
import { getData, storeData } from "@components/LocalStorage";
import { GetToken } from "@api/MH_APP/GetToken";
import { ValidToken } from "@api/MH_APP/ValidToken";
import { RefreshToken } from "@api/MH_APP/RefreshToken";
import { GetDiary } from "@api/MH_APP/GetDiary";
import UseErrorStore from "@store/Error";

const systemicGradeTypeMap: Record<string, string> = {
  Notebook: "Зошит",
  Oral: "Усна відповідь",
  Test: "Тест",

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

  return Object.entries(groups).map(([title, data]) => ({
    title,
    data,
  }));
}

const Diary = () => {
  const [Diaty, SetDiary] = useState<any[]>([]);
  const [Load, SetLoad] = useState(true);

  const seterrors = UseErrorStore((state) => state.setError);

  const applytokendata = async (token: string, studentId: string) => {
    const date = new Date();
    const mm: number = date.getMonth() + 1;
    await GetDiary(token, studentId, mm, 100).then(async (diary) => {
      await storeData("diary", JSON.stringify(diary));
      SetDiary(diary);
      SetLoad(false);
    })
  };

  const handleTokenLogic = async (login: string, password: string) => {
    const tokensRaw = await getData("token_app");

    if (!tokensRaw) {
      const data = await GetToken(login, password);
      await storeData("token_app", JSON.stringify(data));
    } else {
      const token = JSON.parse(tokensRaw);
      const valid = await ValidToken(token);

      if (!valid) {
        const newTokens = await RefreshToken(token);
        if (newTokens) {
          const validsd = await ValidToken(newTokens);
          applytokendata(newTokens, validsd.enrollments[0].studentId);
          await storeData("token_app", JSON.stringify(newTokens));
        } else {
          const data = await GetToken(login, password);
          if (!data) {
            seterrors({
              name: "token error",
              status: true,
              label: "Не вдалось отримати токени",
            });
            navigation.navigate("Stop");
            return;
          }
          await storeData("token_app", JSON.stringify(data));
          const valids = await ValidToken(data);

          applytokendata(data, valids.enrollments[0].studentId);
        }
      } else {
        applytokendata(token, valid.enrollments[0].studentId);
      }
    }
  };

  type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationProp>();
  const { gstyles, WidgetColorText } = Gstyle();

  const p = async () => {
    const login = await getData("login");
    const password = await getData("password");
    if (!login || !password) return;

    console.time("token");
    await handleTokenLogic(login, password);
    console.timeEnd("token");
  };

  useEffect(() => {
    p();
  }, []);

  const sections = groupByDate(Diaty);
  const anim = useRef(new Animated.Value(0)).current;

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

  const renderItem = ({ item, index }: any) => {
    const date = new Date(item.lessonCreatedOn).toLocaleDateString("uk-UA");
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
      const palette = theme === "dark" ? gradeColorDark : gradeColorLight;
      return palette[key] ?? WidgetColorText;
    };

    return (
      <Animated.View
        key={index}
        style={[
          styles.card,
          {
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1],
                }),
              },
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
            opacity: anim,
          },
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.textBlock}>


            <Text style={[styles.title, { color: WidgetColorText }]}>
              {subject}
            </Text>


            <Text style={styles.gradeType}>{gradeType}</Text>
          </View>
          <Text
            style={[
              styles.value,
              {
                color: getGradeColor(
                  grade,
                  useColorScheme() ? "dark" : "light"
                ),
              },
            ]}
          >
            {grade}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Animated.View
      style={[
        styles.sectionHeader,
        {
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0],
              }),
            },
          ],
          opacity: anim,
        },
      ]}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.line} />
    </Animated.View>
  );

  return (
    <View style={[styles.container, gstyles.back]}>
      {Platform.OS !== "ios" &&
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace("App", { screen: "Home" })}
        >
          <Ionicons name="arrow-back" size={24} color="#007aff" />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
      }



      {
        Load ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        ) :
          Diaty.length === 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{fontSize:25,fontWeight:600}}>Поки що немає оцінок 😔</Text>
            </View>
            :
            <SectionList
              sections={sections}
              keyExtractor={(item, index) => item.lessonCreatedOn + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
      }

    </View>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 32,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    marginBottom: 4,
  },
  line: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 16,
    backgroundColor:
      Platform.OS === "android" ? "" : "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,

  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  date: {
    fontSize: 13,
    color: "#8e8e93",
    marginTop: 4,
  },
  gradeType: {
    fontSize: 14,
    color: "#6e6e73",
    marginTop: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 20,
  },
  backText: {
    color: "#007aff",
    fontSize: 16,
    marginLeft: 6,
  },
});