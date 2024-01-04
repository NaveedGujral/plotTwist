import * as React from 'react';
import { Dimensions, Text, View, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

export default function CarouselComponent() {

    const width = Dimensions.get('window').width;
    const testImages = [
        {imageUrl: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_3x2.jpg'},
        {imageUrl: 'https://d3544la1u8djza.cloudfront.net/APHI/Blog/2021/07-06/small+white+fluffy+dog+smiling+at+the+camera+in+close-up-min.jpg'}
    ]

    return (
        <Carousel
            // style="stack-vertical-left"
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            data={testImages}
            scrollAnimationDuration={1000}
            // onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ imageUrl }) => (
                <View style={styles.component}>
                    <Image
                        source={{uri: imageUrl}}
                        // style={{flex: 1, resizeMode: 'cover'}}
                    />
                </View>
            )}
        />
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