export const capitaliseWords = (text: string): string => {
    if (!text) return text;

    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};