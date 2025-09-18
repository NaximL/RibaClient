import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Gstyle } from "styles/gstyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import FullScreenModal from "@components/Modal";

const DatePickerBar = ({ selectedDate, setSelectedDate }: any) => {
  const { isDark, MessageBubleText, MessageBubleTextActive } = Gstyle();
  const today = new Date();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return "Оберіть дату";
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate ?? new Date());
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const openPicker = () => setShowPicker(true);
  const closePicker = () => setShowPicker(false);

  const onChange = (_event: any, date?: Date) => {
    if (Platform.OS !== "web") {
      if (date) setSelectedDate(date);
      closePicker();
    }
  };

  return (
    <BlurView
      intensity={60}
      tint={isDark ? "dark" : "light"}
      style={styles.container}
    >

        <TouchableOpacity onPress={openPicker} activeOpacity={0.7}>
          <Text style={[styles.dateText, { color: MessageBubleText }]}>
            {selectedDate ? formatDate(selectedDate) : formatDate(today)}
          </Text>
        </TouchableOpacity>




      {showPicker && (
        <FullScreenModal visible={showPicker} onClose={closePicker}>
          <Text style={styles.modalTitle}>Оберіть дату</Text>

          {Platform.OS === "web" ? (
            <input
              type="date"
              style={styles.webInput}
              value={(selectedDate || today).toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value));
                closePicker();
              }}
            />
          ) : (
            <DateTimePicker
              value={selectedDate || today}
              mode="date"
              display="spinner"
              onChange={onChange}
              style={{ width: "100%" }}
            />
          )}
        </FullScreenModal>
      )}
    </BlurView>
  );
};

export default DatePickerBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 15,
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 99,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
  },
  arrowBtn: {
    backgroundColor: "rgba(0,136,255,0.15)",
    padding: 10,
    borderRadius: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    minWidth: 150,
    color: "#000",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  webInput: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #ccc",
    outline: "none",
  },
});