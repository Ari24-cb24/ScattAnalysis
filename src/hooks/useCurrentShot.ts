import {useAnalyzerStore, useReplayStore} from "../stores/analyzerstore.ts";
import {IScattShot, ITrace} from "../types/analyzer/scatt_document_types.ts";

export const useCurrentShot = (): [IScattShot, Array<ITrace>] => {
    const [currentShotIdx, shots] = useAnalyzerStore((state) =>
        [state.currentShotIdx, state.shots]);
    const [trace] = useReplayStore((state) => [state.trace]);
    const currentShot = shots[currentShotIdx];

    return [currentShot, trace];
}
