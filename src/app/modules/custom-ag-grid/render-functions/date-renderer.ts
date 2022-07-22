export const DateRenderer = (value: string) => {
    return value ? (new Date(value)).toLocaleDateString() : '';
};

export const DateAndTimeRenderer = (value: string) => {
    return value ? DateRenderer(value) + ' ' + (new Date(value)).toLocaleTimeString() : '';
};

export const StringRenderer = (value: string) => {
    return value ? value : '';
};
