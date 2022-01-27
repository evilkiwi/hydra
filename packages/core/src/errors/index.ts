export const isError = (e: any) => {
    return typeof e === 'object' && e.isHydraError === true;
};

export * from './fetch';
