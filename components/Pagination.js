import { StyleSheet, View, Dimensions, Animated } from "react-native";

const { PTSwatches } = require('../Styling')
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default function Pagination ({listings, scrollX}) {
    return (
        <View style={styles.container}>
            {
                listings.map((_, idx) => {
                    const color = scrollX.interpolate({
                        inputRange: [(idx - 1) * screenWidth, idx * screenWidth, (idx + 1) * screenWidth],
                        outputRange: [PTG1, PTBlue, PTG1], 
                        extrapolate: 'clamp',
                    })

                    const inputRange = [(idx - 1) * screenWidth, idx * screenWidth, (idx + 1) * screenWidth];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [12, 30, 12],
                        extrapolate: 'clamp',
                    })
                    return <Animated.View
                        key={idx.toString()}
                         style={{...styles.dot, width: dotWidth, backgroundColor: color}} />
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        // backgroundColor: '#777',
        backgroundColor: PTG1,
        margin: 2,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})