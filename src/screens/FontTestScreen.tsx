import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { ClashText } from '../components/customComponents/ClashTexts';
import { Colours } from '../styles/shared';

const FontTestScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Standard React Native Text</Text>
                <Text style={styles.regular}>Regular Text (No Font Family)</Text>
                <Text style={styles.bold}>Bold Text (fontWeight: 'bold')</Text>
                <Text style={[styles.regular, { fontFamily: 'normal' }]}>
                    Text with fontFamily: 'normal'
                </Text>
                <Text style={[styles.regular, { fontFamily: 'System' }]}>
                    Text with fontFamily: 'System'
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ClashText Component</Text>
                <ClashText>ClashText Default</ClashText>
                <ClashText bold>ClashText Bold</ClashText>
                <ClashText style={{ fontSize: 18, color: Colours.decorative.purple }}>
                    ClashText with Custom Style
                </ClashText>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Direct Font Tests</Text>
                <Text style={{ fontFamily: 'ClashGrotesk', fontSize: 32 }}>
                    Direct ClashGrotesk
                </Text>
                <Text style={{ fontFamily: 'ArefRuqaa', fontSize: 16 }}>
                    Direct ArefRuqaa
                </Text>
                <Text style={{ fontFamily: 'ArefRuqaa-Bold', fontSize: 16 }}>
                    Direct ArefRuqaa-Bold
                </Text>
                <Text style={{ fontFamily: 'NotoKufiArabic', fontSize: 16 }}>
                    Direct NotoKufiArabic
                </Text>
                <Text style={{ fontFamily: 'NotoKufiArabic-Bold', fontSize: 16 }}>
                    Direct NotoKufiArabic-Bold
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Arabic Text Tests</Text>
                <Text style={{ fontFamily: 'ArefRuqaa', fontSize: 22, textAlign: 'right' }}>
                    مرحبا بالعالم
                </Text>
                <Text style={{ fontFamily: 'NotoKufiArabic', fontSize: 22, textAlign: 'right' }}>
                    مرحبا بالعالم
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Platform Information</Text>
                <Text style={styles.regular}>OS: {Platform.OS}</Text>
                <Text style={styles.regular}>Version: {Platform.Version}</Text>
                <Text style={styles.regular}>
                    Is Font Scaling Enabled: {Platform.OS === 'ios' ? String(Platform.isPad) : 'N/A'}
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    section: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: Colours.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colours.secondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colours.decorative.teal,
        borderBottomWidth: 1,
        borderBottomColor: Colours.decorative.teal,
        paddingBottom: 5,
    },
    regular: {
        fontSize: 16,
        marginBottom: 10,
    },
    bold: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default FontTestScreen;