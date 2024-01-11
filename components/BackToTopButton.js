import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function BackToTopButton ({scrollRef, scrollOffset, scrollOffsetLimit}) {
    if (scrollOffset > scrollOffsetLimit) {
        return (
            <View style={{flex: 1,}}>
                <Pressable style={Platform.OS === 'web' ? {...styles.BTTContainer, ...styles.BTTHeight} : styles.BTTContainer} onPress={() => {
                    scrollRef.current?.scrollTo({
                        y : 0,
                        animated : true
                    });
                }}>
                    <View style={styles.BTTCircle}>
                        <Ionicons
                            name="arrow-up"
                            size={30}
                            color="black"
                            style={styles.BTTArrow}
                        />
                    </View>
                </Pressable>
                <BackToTopButton scrollRef={scrollRef} scrollOffset={scrollOffset} scrollOffsetLimit={scrollOffsetLimit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    BTTContainer: {
		position: 'absolute',
		bottom: 15,
		right: 15,
	},
	BTTHeight: {
		bottom: 98,
	},
	BTTCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'white',
		shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 16,
		justifyContent: 'center',
		alignContent: 'center',
	},
	BTTArrow: {
		textAlign: 'center',
		width: '100%',
	}
})