
export const formatMillisToMin = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    return `${minutes}`;
}

export const formatMillisToMinSec = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const remainingSeconds = millis % 60000;
    const seconds = Math.floor(remainingSeconds / 1000);
    return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
}

export const formatMillisToMinSecMillis = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const remainingSeconds = millis % 60000;
    const seconds = Math.floor(remainingSeconds / 1000);
    const milliseconds = Math.floor(remainingSeconds % 1000);
    const millisString = String(milliseconds).length === 1 ? `00${milliseconds}` : String(milliseconds).length === 2 ? `0${milliseconds}` : milliseconds;

    return [`${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`, millisString];
}
