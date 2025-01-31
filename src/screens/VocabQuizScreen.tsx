import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChooseWordsSection } from '../components/ChooseWordsSection';
import VocabQuestionSection from '../components/quiz/VocabQuestionSection';
import { apiClient } from '../utils/apiClient';

export default function VocabQuizScreen() {
    const [chosenWordsList, setChosenWordsList] = useState<string>("choose");
    const [quizId, setQuizId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);

    const handleChooseWordsList = async (listChoice: string) => {
        try {
            const response = await apiClient.post('/quiz/create-vocab-quiz', {
                category_id: listChoice
            });
            setQuizId(response.quiz_id);
            setChosenWordsList(listChoice);
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    const handleBack = () => {
        setChosenWordsList("choose");
        setQuizId(null);
        setCategoryName(null);
    };

    return (
        <View style={styles.container}>
            {chosenWordsList === "choose" ? (
                <ChooseWordsSection
                    onChoose={handleChooseWordsList}
                    setCategoryName={setCategoryName}
                />
            ) : (
                <VocabQuestionSection
                    quizId={quizId!}
                    categoryName={categoryName}
                    onBack={handleBack}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});