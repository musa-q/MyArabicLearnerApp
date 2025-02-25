import {
    View,
    ActivityIndicator,
} from 'react-native';
import { Colours } from '../../styles/shared';

export default function LoadingComp() {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colours.background
        }}>
            <ActivityIndicator size="large" color={Colours.decorative.purple} />
        </View>
    );
}