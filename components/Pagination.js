import { StyleSheet, View, Dimensions, Animated } from "react-native";

const { PTSwatches } = require('../Styling')
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

const { height, width } = Dimensions.get("window");

export default function Pagination ({listings, scrollX}) {
    return (
        <View 
            style={{
                flex: 1/3, 
                flexDirection: 'row', 
                justifyContent: "space-between",
                width: "33%"
            }}>
            {
                listings.map((_, idx) => {
                    const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
                    const minWidth = width*0.0112
                    const maxWidth = 1.33*minWidth
                    const minRad = minWidth/2
                    const maxRad = maxWidth/2
                    
                    const color = scrollX.interpolate({
                      inputRange,
                      outputRange: [PTG2, PTG1, PTG2],
                      extrapolate: "clamp",
                    });

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [minWidth, maxWidth, minWidth],
                        extrapolate: 'clamp',
                    })
                    
                    const dotRad = scrollX.interpolate({
                        inputRange,
                        outputRange: [minRad, maxRad, minRad],
                        extrapolate: 'clamp',
                    })

                    return <Animated.View
                        key={idx.toString()}
                        style={{
                            alignSelf: "center",
                            borderRadius: dotRad,
                            margin: dotRad, 
                            height: dotWidth,
                            width: dotWidth, 
                            backgroundColor: color
                    }} />
                })
            }
        </View>
    )
}
