import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import { Gstyle } from "styles/gstyles";

type Props = {
  text: string | React.ReactNode;
  visible: boolean;
  onHide: () => void;
};

const BottomAlert: React.FC<Props> = ({ text, visible, onHide }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { gstyles, WidgetColorText } = Gstyle();

  useEffect(() => {
    if (visible) {
      // Поява з easing
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease), // ⬅️ плавний виїзд
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 400,
            easing: Easing.in(Easing.ease), 
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.toast,
                gstyles.WidgetBack,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            {typeof text === "string" ? <Text style={[styles.text,{color:WidgetColorText}]}>{text}</Text> : text}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        bottom: 40,
        left: 20,
        right: 20,

        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        elevation: 5,
    },
    text: {
      
        fontSize: 14,
        fontWeight: "500",
    },
});

export default BottomAlert;