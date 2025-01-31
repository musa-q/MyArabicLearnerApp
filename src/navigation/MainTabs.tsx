import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import PracticeScreen from '../screens/PracticeScreen';
import VerbConjugationQuizScreen from '../screens/VerbConjugationQuizScreen';
import VocabQuizScreen from '../screens/VocabQuizScreen';
import UserProfile from '../screens/UserProfile';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import Learn from '../screens/LearnScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PracticeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PracticeScreen"
                component={PracticeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="VocabQuiz"
                component={VocabQuizScreen}
                options={{
                    headerShown: false,
                    title: 'Verb Conjugation Quiz'
                }}
            />
            <Stack.Screen
                name="VerbConjugationQuiz"
                component={VerbConjugationQuizScreen}
                options={{
                    headerShown: false,
                    title: 'Verb Conjugation Quiz'
                }}
            />
        </Stack.Navigator>
    );
}

function LearnStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Learn"
                component={Learn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Flashcards"
                component={FlashcardsScreen}
                options={{
                    headerShown: false,
                    title: 'Flashcards'
                }}
            />
        </Stack.Navigator>
    );
}

function UserProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={UserProfile}
                options={
                    {
                        headerShown: true,
                    }
                }
            />
            <Stack.Screen
                name="QuizResults"
                component={QuizResultsScreen}
                options={{
                    headerShown: true,
                    title: 'All Quiz Results'
                }}
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
                    return <Ionicons name={iconName as any} size={24} color={color} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Home'
                }}
            />
            <Tab.Screen
                name="Learning"
                component={LearnStack}
                options={{
                    title: 'Learn',
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Practice"
                component={PracticeStack}
                options={{
                    title: 'Practice'
                }}
            />
            <Tab.Screen
                name="UserProfile"
                component={UserProfileStack}
                options={{
                    title: 'Profile',
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}