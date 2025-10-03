import { Pressable, StyleSheet, Text, useWindowDimensions, Animated, Platform } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Gstyle } from '@styles/gstyles';

const HomeWorkEl = ({ item, cardAnim, index, SetSitemect }: any) => {


    const { gstyles, WidgetColorText } = Gstyle()
    const { width } = useWindowDimensions();
    const containsHTML = (str: string) => typeof str === 'string' && /<\/?[a-z][\s\S]*>/i.test(str);

    return (

        <Animated.View
            key={index}
            style={{
                ...gstyles.WidgetBack,
                ...styles.card,
                opacity: cardAnim,
                transform: [
                    { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                    { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }
                ]
            }}
        >
            <Pressable onPress={() => {
                SetSitemect(item);
            }}>
                <Text style={[styles.label, { color: WidgetColorText }]}>{item.Dalykas ?? ''}</Text>
                {item.UzduotiesAprasymas && containsHTML(item.UzduotiesAprasymas) ? (
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: item.UzduotiesAprasymas }}
                        baseStyle={{ ...styles.value, color: WidgetColorText }}
                        ignoredDomTags={['o:p']}
                        defaultTextProps={{
                            selectable: false,
                        }}
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
                    <Text style={[styles.value, { color: WidgetColorText }]}>{item.UzduotiesAprasymas ?? '...'}</Text>
                )}
            </Pressable>
        </Animated.View>
    );
}

export default HomeWorkEl;





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(247, 247, 250)',
        paddingVertical: Platform.OS === 'ios' || Platform.OS === 'android' ? 50 : 0,

    },
    contentContainer: {
        padding: 18,
    },
    card: {

        borderRadius: 18,
        padding: 20,
        marginBottom: 14,

        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        elevation: 2,
    },
    label: {
        fontWeight: '600',
        fontSize: 17,
        marginBottom: 8,

    },
    value: {
        fontSize: 15,
        color: '#444',
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#aaa",
        fontSize: 16,
    },
});