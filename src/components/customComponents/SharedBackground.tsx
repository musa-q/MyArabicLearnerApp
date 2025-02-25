import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Platform,
    StatusBar,
} from 'react-native';
import { Colours } from '../../styles/shared';
import { backgroundImage } from '../../utils/assetUtils';

interface SharedBackgroundProps {
    children: React.ReactNode;
}

export default function SharedBackground({ children }: SharedBackgroundProps) {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={backgroundImage}
                style={styles.backgroundImage}
            >
                {children}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
});