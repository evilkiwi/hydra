export class HydraError extends Error {
    isHydraError = true;

    constructor(message: string) {
        super(message);
    }
}
