import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../../utils/apiClient';
import { capitaliseWords } from '../../../utils/textUtils';
import { ClashText } from '../../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../../styles/shared';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';

interface Verb {
    id: string;
    verb: string;
}

interface Conjugation {
    pronoun: string;
    tense: string;
    conjugation: string;
}

const pronounMapping: Record<string, string> = {
    'i': 'أنا',
    'you_m': 'أنت',
    'you_f': 'أنتِ',
    'he': 'هو',
    'she': 'هي',
    'we': 'إحنا',
    'they': 'هم'
};

export default function VerbConjugationTableScreen() {
    const [verbs, setVerbs] = useState<Verb[]>([]);
    const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
    const [conjugations, setConjugations] = useState<Conjugation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        fetchVerbs();
    }, []);

    const fetchVerbs = async () => {
        try {
            const response = await apiClient.post('/visualisers/get-verbs');
            setVerbs(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching verbs:', error);
            setError('Failed to load verbs');
            setIsLoading(false);
        }
    };

    const fetchConjugations = async (verbId: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/visualisers/get-verb-table', {
                verbId: verbId
            });
            setConjugations(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching conjugations:', error);
            setError('Failed to load conjugations');
            setIsLoading(false);
        }
    };

    const handleVerbSelect = (verb: Verb) => {
        setSelectedVerb(verb);
        setIsDropdownVisible(false);
        fetchConjugations(verb.id);
    };

    const renderVerbItem = ({ item }: { item: Verb }) => (
        <TouchableOpacity
            style={[
                styles.dropdownItem,
                selectedVerb?.id === item.id && styles.dropdownItemSelected
            ]}
            onPress={() => handleVerbSelect(item)}
        >
            <ClashText style={[
                styles.dropdownItemText,
                selectedVerb?.id === item.id ? styles.dropdownItemTextSelected : {}
            ]}>
                {item.verb.toLowerCase()}
            </ClashText>
            {selectedVerb?.id === item.id && (
                <MaterialCommunityIcons name="check" size={20} color={Colours.decorative.purple} />
            )}
        </TouchableOpacity>
    );

    interface ConjugationRow {
        pronoun: string;
        [key: string]: string;
    }

    const renderConjugations = () => {
        const tenses = ['past', 'present', 'future'];
        const pronouns = [...new Set(conjugations.map(conjugation => conjugation.pronoun))];

        return pronouns.map(pronoun => {
            const row: ConjugationRow = { pronoun: pronounMapping[pronoun] || pronoun };
            tenses.forEach(tense => {
                const conjugation = conjugations.find(c =>
                    c.pronoun === pronoun && c.tense === tense
                );
                row[tense] = conjugation ? conjugation.conjugation : '';
            });
            return row;
        });
    };

    if (isLoading && !conjugations.length) {
        return (
            <MainPageLayout>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colours.decorative.purple} />
                </View>
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            <View style={styles.container}>
                <ClashText style={styles.title}>verb conjugation visualiser</ClashText>

                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsDropdownVisible(true)}
                >
                    <ClashText style={styles.dropdownButtonText}>
                        {selectedVerb
                            ? selectedVerb.verb.toLowerCase()
                            : 'choose a verb'}
                    </ClashText>
                    <MaterialCommunityIcons
                        name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={Colours.decorative.purple}
                    />
                </TouchableOpacity>

                <Modal
                    visible={isDropdownVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsDropdownVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsDropdownVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <ClashText style={styles.modalHeaderText}>select verb</ClashText>
                                <TouchableOpacity
                                    onPress={() => setIsDropdownVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <MaterialCommunityIcons name="close" size={24} color={Colours.text.primary} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={verbs}
                                renderItem={renderVerbItem}
                                keyExtractor={(item) => item.id}
                                style={styles.dropdownList}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>past</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>present</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>future</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>pronoun</ClashText>
                        </View>
                    </View>

                    <ScrollView style={styles.tableBody}>
                        {conjugations.length > 0 ? (
                            renderConjugations().map((row, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tableRow,
                                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                                    ]}
                                >
                                    <View style={styles.cell}>
                                        <ClashText style={styles.conjugationText}>{row.past}</ClashText>
                                    </View>
                                    <View style={styles.cell}>
                                        <ClashText style={styles.conjugationText}>{row.present}</ClashText>
                                    </View>
                                    <View style={styles.cell}>
                                        <ClashText style={styles.conjugationText}>{row.future}</ClashText>
                                    </View>
                                    <View style={styles.cell}>
                                        <ClashText style={styles.pronounText}>{row.pronoun}</ClashText>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons
                                    name="book-outline"
                                    size={48}
                                    color={Colours.decorative.purple}
                                    style={styles.emptyIcon}
                                />
                                <ClashText style={styles.emptyText}>
                                    choose a verb to view conjugations
                                </ClashText>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 20,
    },
    dropdownButton: {
        height: 50,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownButtonText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colours.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
    },
    modalHeaderText: {
        ...Typography.headingMedium,
        fontSize: 18,
        color: Colours.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    dropdownList: {
        padding: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 8,
    },
    dropdownItemSelected: {
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
    },
    dropdownItemText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    dropdownItemTextSelected: {
        color: Colours.decorative.purple,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: Colours.secondary,
        opacity: 0.2,
    },
    tableCard: {
        flex: 1,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colours.decorative.purple,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: Colours.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    },
    tableBody: {
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
    },
    evenRow: {
        backgroundColor: 'rgba(245, 240, 230, 0.5)',
    },
    oddRow: {
        backgroundColor: Colours.surface,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    conjugationText: {
        ...Typography.arabic,
        fontSize: 16,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    pronounText: {
        ...Typography.arabic,
        fontSize: 16,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.secondary,
        textAlign: 'center',
    },
});