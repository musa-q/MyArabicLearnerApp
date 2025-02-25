import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colours, Typography } from '../styles/shared';

import HomeScreen from '../screens/loggedin/HomeScreen';
import FlashcardsScreen from '../screens/loggedin/learn/FlashcardsScreen';
import PracticeScreen from '../screens/loggedin/practice/PracticeScreen';
import VerbConjugationQuizScreen from '../screens/loggedin/practice/VerbConjugationQuizScreen';
import VocabQuizScreen from '../screens/loggedin/practice/VocabQuizScreen';
import UserProfile from '../screens/loggedin/UserProfile';
import QuizResultsScreen from '../screens/loggedin/QuizResultsScreen';
import Learn from '../screens/loggedin/learn/LearnScreen';
import VocabTableScreen from '../screens/loggedin/learn/VocabTableScreen';
import VerbConjugationTableScreen from '../screens/loggedin/learn/VerbConjugationTableScreen';
import CheatSheetSelectionScreen from '../screens/loggedin/learn/CheatSheetSelectionScreen';
import VerbCheatsheetScreen from '../components/cheatsheets/VerbCheatSheetScreen';
import SentenceConstructionScreen from '../components/cheatsheets/SentenceConstructionScreen';
import PossessiveEndingsScreen from '../components/cheatsheets/PossessiveEndingsScreen';
import NegationScreen from '../components/cheatsheets/NegationScreen';
import PluralisationScreen from '../components/cheatsheets/PluralisationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const sharedStackScreenOptions = {
    headerStyle: {
        backgroundColor: Colours.decorative.purple,
    },
    headerTintColor: Colours.text.inverse,
    headerTitleStyle: {
        ...Typography.headingMedium,
        color: Colours.text.inverse,
    },
};

function PracticeStack() {
    return (
        <Stack.Navigator
            screenOptions={sharedStackScreenOptions}
        >
            <Stack.Screen
                name="PracticeScreen"
                component={PracticeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VocabQuiz"
                component={VocabQuizScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VerbConjugationQuiz"
                component={VerbConjugationQuizScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function LearnStack() {
    return (
        <Stack.Navigator
            screenOptions={sharedStackScreenOptions}
        >
            <Stack.Screen
                name="Learn"
                component={Learn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Flashcards"
                component={FlashcardsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VocabTable"
                component={VocabTableScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VerbConjugationTable"
                component={VerbConjugationTableScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CheatSheetScreen"
                component={CheatSheetStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function UserProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={sharedStackScreenOptions}
        >
            <Stack.Screen
                name="Profile"
                component={UserProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QuizResults"
                component={QuizResultsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function CheatSheetStack() {
    return (
        <Stack.Navigator
            screenOptions={sharedStackScreenOptions}
        >
            <Stack.Screen
                name="CheatSheetSelection"
                component={CheatSheetSelectionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VerbCheatSheet"
                component={VerbCheatsheetScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SentenceConstruction"
                component={SentenceConstructionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PossessiveEndings"
                component={PossessiveEndingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Negation"
                component={NegationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Pluralisation"
                component={PluralisationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Learning':
                            iconName = focused ? 'bulb' : 'bulb-outline';
                            break;
                        case 'Practice':
                            iconName = focused ? 'school' : 'school-outline';
                            break;
                        case 'UserProfile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colours.decorative.purple,
                tabBarInactiveTintColor: Colours.text.secondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colours.surface,
                    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -3 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                        },
                        android: {
                            elevation: 8,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    ...Typography.body,
                    fontSize: 12,
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={{ flex: 1 }}
                    />
                ),
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'home'
                }}
            />
            <Tab.Screen
                name="Learning"
                component={LearnStack}
                options={{
                    title: 'learn'
                }}
            />
            <Tab.Screen
                name="Practice"
                component={PracticeStack}
                options={{
                    title: 'practice'
                }}
            />
            <Tab.Screen
                name="UserProfile"
                component={UserProfileStack}
                options={{
                    title: 'profile'
                }}
            />
        </Tab.Navigator>
    );
}