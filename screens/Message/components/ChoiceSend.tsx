import {
    View,
    Text,
    StyleSheet
} from "react-native";



const ChoiceSend = () => {
    return (

        <View style={{ flex: 1, marginLeft: 5, flexDirection: "row", gap: 5 }}>


            <View style={[styles.choConteiner, {
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                borderColor: '#007aff',
            }]}>
                <Text style={[styles.choConteinerText, { color: '#007aff' }]}>
                    Отримані
                </Text>
            </View>
            <View style={[styles.choConteiner, {
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderColor: '#ff9500',
            }]}>
                <Text style={[styles.choConteinerText, { color: '#ff9500' }]}>
                    Відправлені
                </Text>
            </View>

        </View>);
}

export default ChoiceSend;


const styles = StyleSheet.create({
    choConteiner: {
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    choConteinerText: {
        color: "white"
    }
})
