import React from 'react';
import { Text, TextStyle, TextProps, TextInput, TextInputProps } from 'react-native';

interface ClashTextProps extends TextProps {
    bold?: boolean;
    style?: TextStyle | TextStyle[];
}

export const ClashText: React.FC<ClashTextProps> = (props) => {
    const { style, bold, children, ...rest } = props;

    const fontStyle: TextStyle = bold ? { fontFamily: 'ClashGrotesk-Light', fontWeight: 'bold' } : { fontFamily: 'ClashGrotesk' };

    return (
        <Text
            {...rest}
            style={[
                fontStyle,
                Array.isArray(style) ? style : style ? [style] : [],
            ]}
        >
            {children}
        </Text>
    );
};

interface ClashTextInputProps extends TextInputProps {
    style?: TextStyle | TextStyle[];
}

export const ClashTextInput: React.FC<ClashTextInputProps> = (props) => {
    const { style, ...rest } = props;

    return (
        <TextInput
            {...rest}
            style={[
                { fontFamily: 'ClashGrotesk-Light' },
                Array.isArray(style) ? style : style ? [style] : [],
            ]}
        />
    );
};

// Only export the named exports, not the default
export default { ClashText, ClashTextInput };