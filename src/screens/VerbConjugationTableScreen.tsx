import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';
import { capitaliseWords } from '../utils/textUtils';

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
            <Text style={[
                styles.dropdownItemText,
                selectedVerb?.id === item.id && styles.dropdownItemTextSelected
            ]}>
                {capitaliseWords(item.verb)}
            </Text>
            {selectedVerb?.id === item.id && (
                <Ionicons name="checkmark" size={20} color="#6200ee" />
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
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verb Conjugation Visualiser</Text>

            {/* Custom Dropdown */}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedVerb
                        ? capitaliseWords(selectedVerb.verb)
                        : 'Choose a Verb'}
                </Text>
                <Ionicons
                    name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6200ee"
                />
            </TouchableOpacity>

            {/* Dropdown Modal */}
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
                            <Text style={styles.modalHeaderText}>Select Verb</Text>
                            <TouchableOpacity
                                onPress={() => setIsDropdownVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#333" />
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
                        <Text style={styles.headerText}>Past</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Present</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Future</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Pronoun</Text>
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
                                    <Text style={styles.conjugationText}>{row.past}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.conjugationText}>{row.present}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.conjugationText}>{row.future}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.pronounText}>{row.pronoun}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="book-outline"
                                size={48}
                                color="#6200ee"
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyText}>
                                Choose a verb to view conjugations
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 20,
    },
    dropdownButton: {
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
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
        borderBottomColor: '#e0e0e0',
    },
    modalHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
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
        backgroundColor: '#f0e6ff',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownItemTextSelected: {
        color: '#6200ee',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    tableCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
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
        borderBottomColor: '#e0e0e0',
    },
    evenRow: {
        backgroundColor: '#f8f9fa',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    conjugationText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'System',  // You might want to use a specific Arabic font here
    },
    pronounText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'System',  // You might want to use a specific Arabic font here
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
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});