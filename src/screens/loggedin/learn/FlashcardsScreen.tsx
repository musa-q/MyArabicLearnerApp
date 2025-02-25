import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChooseWordsSection } from '../../../components/ChooseWordsSection';
import FlashCardsSection from '../../../components/flashcards/FlashCardsSection';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';
import { Colours } from '../../../styles/shared';

export default function FlashcardsScreen() {
    const [chosenWordsList, setChosenWordsList] = useState<string>("choose");
    const [categoryName, setCategoryName] = useState<string | null>(null);

    const handleChooseWordsList = (listChoice: string) => {
        setChosenWordsList(listChoice);
    };

    const handleBack = () => {
        setChosenWordsList("choose");
    };

    return (
        <MainPageLayout disableScroll={chosenWordsList !== "choose"}>
            <View style={styles.container}>
                {chosenWordsList === "choose" ? (
                    <ChooseWordsSection
                        onChoose={handleChooseWordsList}
                        setCategoryName={setCategoryName}
                    />
                ) : (
                    <FlashCardsSection
                        wordsList={chosenWordsList}
                        categoryName={categoryName}
                        onBack={handleBack}
                    />
                )}
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});