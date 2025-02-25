import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    StatusBar,
    ScrollView,
    Image,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colours, Typography } from '../../styles/shared';
import SharedBackground from './SharedBackground';
import { logoStrip, arabesque } from '../../utils/assetUtils';

const { width } = Dimensions.get('window');

interface MainPageLayoutProps {
    children: React.ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
    disableScroll?: boolean;
}

export default function MainPageLayout({
    children,
    refreshing = false,
    onRefresh,
    disableScroll = false
}: MainPageLayoutProps) {
    if (disableScroll) {
        return (
            <View style={styles.container}>
                <SharedBackground>
                    <BlurView
                        intensity={3}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.scrollView}>
                        <Image
                            source={logoStrip}
                            style={styles.arabesque}
                            resizeMode="contain"
                        />
                        {children}
                    </View>
                </SharedBackground>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SharedBackground>
                <BlurView
                    intensity={3}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                />
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={Colours.decorative.purple}
                                colors={[Colours.decorative.purple]}
                                progressBackgroundColor={Colours.surface}
                            />
                        ) : undefined
                    }
                >
                    <Image
                        source={logoStrip}
                        style={styles.arabesque}
                        resizeMode="contain"
                    />
                    {children}
                    <Image
                        source={arabesque}
                        style={[styles.arabesque, styles.bottomArabesque]}
                        resizeMode="contain"
                    />
                </ScrollView>
            </SharedBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
    },
    arabesque: {
        width: width,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomArabesque: {
        // marginTop: 20,
    },
});