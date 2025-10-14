import { Platform, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../router/router";
import { useNavigation } from "@react-navigation/native";
import { Gstyle } from "@styles/gstyles";
import usePageStore from "@store/PageStore";
import { tabs } from "../router/AppTabs";

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface ReturnElemProps {
    style?: object;
    url?: any;
}

const ReturnElem = ({ style, url = "Home" }: ReturnElemProps) => {
    if (Platform.OS === "ios") return null; 

    const navigation = useNavigation<NavigationProp>();
    const { GlobalColor } = Gstyle();
    const { SetPage } = usePageStore();

    const index = tabs.findIndex((t) => t.name === url);

    const handlePress = () => {
        if (index === -1) return;
        SetPage(index);
        navigation.replace("App", { screen: url });
    };

    return (
        <TouchableOpacity style={[styles.backButton, style]} onPress={handlePress}>
            <Ionicons name="chevron-back" size={24} color={GlobalColor} />
            <Text style={[styles.backText, { color: GlobalColor }]}>Назад</Text>
        </TouchableOpacity>
    );
};

export default ReturnElem;

const styles = StyleSheet.create({
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    backText: {
        fontSize: 16,
        fontWeight: "500",
    },
});