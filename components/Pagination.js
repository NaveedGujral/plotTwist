import { StyleSheet, View, Dimensions, Animated } from "react-native";

const { PTSwatches } = require('../Styling')
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default function Pagination ({listings, scrollX}) {
    return (
        <View 
            style={{
                flex: 1, 
                flexDirection: 'row', 
                width: screenWidth* 0.6, 
                alignItems: 'center', 
                justifyContent: 'space-evenly'
            }}>
            {
                listings.map((_, idx) => {
                    const color = scrollX.interpolate({
                      inputRange: [
                        (idx - 1) * screenWidth,
                        idx * screenWidth,
                        (idx + 1) * screenWidth,
                      ],
                      outputRange: [PTG1, PTBlue, PTG1],
                      extrapolate: "clamp",
                    });

                    const inputRange = [(idx - 1) * screenWidth, idx * screenWidth, (idx + 1) * screenWidth];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [screenWidth*0.03, screenWidth*0.09, screenWidth*0.03],
                        extrapolate: 'clamp',
                    })
                    return <Animated.View
                        key={idx.toString()}
                        style={{
                            height: screenWidth*0.03,
                            borderRadius: screenWidth*0.015,
                            margin: 2, 
                            width: dotWidth, 
                            backgroundColor: color
                    }} />
                })
            }
        </View>
    )
}