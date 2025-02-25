import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChooseWordsSection } from '../../../components/ChooseWordsSection';
import VocabQuestionSection from '../../../components/quiz/VocabQuestionSection';
import { apiClient } from '../../../utils/apiClient';
import { Colours } from '../../../styles/shared';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';

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
        <MainPageLayout >
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
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
    },
});