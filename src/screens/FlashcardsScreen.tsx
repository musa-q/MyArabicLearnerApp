import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChooseWordsSection } from '../components/flashcards/ChooseWordsSection';
import FlashCardsSection from '../components/flashcards/FlashCardsSection';

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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
