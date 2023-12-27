
export const formatMillisToMin = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    return `${minutes}`;
}

export const formatMillisToMinSec = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
}

export const formatMillisToMinSecMillis = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    let milliseconds = (millis % 1000).toFixed(0);
    milliseconds = milliseconds.length === 1 ? `00${milliseconds}` : milliseconds.length === 2 ? `0${milliseconds}` : milliseconds;
    return [`${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`, milliseconds];
}
