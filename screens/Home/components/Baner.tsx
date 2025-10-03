import { StyleSheet, Text, View } from "react-native";
import { Gstyle } from "@styles/gstyles";

type Props = {
    status: boolean;
    text: string;

}
const Baner = ({ status,text }: Props) => {
    const { gstyles, WidgetColorText } = Gstyle()
    return (
        status &&
        <View style={[styles.card, gstyles.WidgetBack]}>
            <Text style={[styles.BanerText, { color: WidgetColorText }]}>{text}</Text>
        </View>
    );
}

export default Baner;

const styles = StyleSheet.create({
    card: {
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 12,
        borderRadius: 10,
        fontSize: 16,
        width: '90%',

        alignItems: 'center',
        gap: 10,
        zIndex: 1000,

    },

    BanerText: {

        fontSize: 16,
        fontWeight: '700',
    }
})