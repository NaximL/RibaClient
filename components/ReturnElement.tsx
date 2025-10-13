import { Platform, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../router/router";
import { useNavigation } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";

const ReturnElem = ({ style }: any) => {
    type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;
    const navigation = useNavigation<NavigationProp>();
    const { GlobalColor } = Gstyle();

    return Platform.OS !== "ios" &&
        <TouchableOpacity
            style={[styles.backButton, style]}
            onPress={() => navigation.replace("App", { screen: "Home" })}
        >
            <Ionicons name="chevron-back" size={24} color="#007aff" />
            <Text style={[styles.backText, { color: GlobalColor }]}>Назад</Text>
        </TouchableOpacity>


}

export default ReturnElem;


const styles = StyleSheet.create({
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,

    },
    backText: {
        fontSize: 16,
        bottom:0.8,
        fontWeight: "500",
    },
})