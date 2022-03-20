export const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = async (length: number) => new Promise<void>(resolve => {
    setTimeout(() => resolve(), length);
});

export * from './ping';
