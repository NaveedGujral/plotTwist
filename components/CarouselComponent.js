import * as React from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

export default function CarouselComponent() {
    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[1, 2, 3]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index, data }) => (
                    <View style={styles.component}>
                        <Text style={styles.componentText}>{data[index]}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    component: {
        flex: 1,
        borderWidth: 1,
        justifyContent: 'center',
    },
    componentText: {
        textAlign: 'center',
        fontSize: 30
    }
})