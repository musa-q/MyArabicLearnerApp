export interface Word {
    arabic: string;
    english: string;
    category: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizResult {
    id: string;
    score: number;
    totalQuestions: number;
    date: string;
    category: string;
}