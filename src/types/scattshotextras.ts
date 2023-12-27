export interface IShotExtra {
    rings: number;
    ringsFraction: number;
    durationMillis: number;
    aveSpeed: number;
    aveSpeed250ms: number;
    bestResultBefore: {
        deltaTime: number;
        absTime: number;
        result: number;
    }
}