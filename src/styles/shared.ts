import { Platform } from 'react-native';

export const Colours = {
    primary: '#2581BB',     // Blue for arabesque
    secondary: '#C19B6C',   // Warm gold
    accent: '#45A6A3',      // Turquoise
    tertiary: '#8D4C32',    // Terracotta
    surface: '#FFF8F0',     // Warm white
    background: '#F5F0E6',  // Sand beige
    text: {
        primary: '#2D2A32',   // Deep charcoal
        secondary: '#5C5A5F', // Soft gray
        inverse: '#FFFFFF'    // White
    },
    decorative: {
        gold: '#DAA520',      // Metallic gold
        lightGold: '#F4D03F',    // Light gold
        copper: '#B87333',    // Copper
        teal: '#45A6A3',       // Teal
        tealBorder: '#317775',    // Darker teal for borders
        purple: '#A78BFA'     // Light purple for tint
    }
};

export const Patterns = {
    geometric1: `<svg viewBox="0 0 100 100">
      <path d="M0 0h100v100H0z" fill="${Colours.background}"/>
      <path d="M50 0L0 50l50 50 50-50z" fill="${Colours.primary}" opacity="0.05"/>
    </svg>`,
    geometric2: `<svg viewBox="0 0 100 100">
      <path d="M0 0h100v100H0z" fill="${Colours.background}"/>
      <path d="M25 0l50 50-50 50L-25 50z" fill="${Colours.secondary}" opacity="0.05"/>
    </svg>`
};

export const Typography = {
    headingLarge: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colours.text.primary,
        textAlign: 'center'
    },
    headingMedium: {
        fontSize: 24,
        color: Colours.text.primary
    },
    body: {
        fontSize: 16,
        fontWeight: 0,
        color: Colours.text.secondary,
        lineHeight: 24
    },
    arabic: {
        fontSize: 32,
        fontFamily: 'NotoKufiArabic',
        textAlign: 'right',
        color: Colours.text.primary
    },
    arabicBold: {
        fontSize: 32,
        fontFamily: 'NotoKufiArabic-Bold',
        textAlign: 'right',
        fontWeight: 800,
        color: Colours.text.primary
    },
    arabicRuqaa: {
        fontSize: 32,
        fontFamily: 'ArefRuqaa',
        textAlign: 'right',
        color: Colours.text.primary
    },
    arabicRuqaaBold: {
        fontSize: 32,
        fontFamily: 'ArefRuqaa-Bold',
        textAlign: 'right',
        fontWeight: 800,
        color: Colours.text.primary
    }
};

export const ComponentStyles = {
    card: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colours.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderColor: Colours.secondary,
        borderWidth: 1
    },
    button: {
        primary: {
            backgroundColor: Colours.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        secondary: {
            backgroundColor: 'transparent',
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            borderColor: Colours.secondary,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center'
        }
    },
    input: {
        backgroundColor: Colours.surface,
        borderWidth: 1,
        borderColor: Colours.secondary,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        // color: Colours.text.primary
    }
};

export const Decorative = {
    arabesque: {
        width: '100%',
        height: 40,
        marginVertical: 20,
        opacity: 0.2
    },
    divider: {
        height: 2,
        backgroundColor: Colours.secondary,
        opacity: 0.2,
        marginVertical: 20
    }
};