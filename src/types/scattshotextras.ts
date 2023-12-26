export interface IShotExtra {
    durationMillis: number;
    aveSpeed: number;
    aveSpeed250ms: number;
    bestResultBefore: {
        deltaTime: number;
        absTime: number;
        result: number;
    }
}