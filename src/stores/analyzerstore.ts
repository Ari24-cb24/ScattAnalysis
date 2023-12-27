import {create} from "zustand";
import {IScattShot} from "../types/analyzer/scatt_document_types.ts";
import {IShotExtra} from "../types/scattshotextras.ts";


interface AnalyzerData {
    currentShotIdx: number;
    currentShot: IScattShot | null;
    shotExtras: Array<IShotExtra>;
    replayPercentage: number;
    isReplayPlaying: boolean;

    setCurrentShot: (currentShotIdx: number, shot: IScattShot) => void;
    setShotExtras: (shotExtras: Array<IShotExtra>) => void;
    setReplayPercentage: (replayPercentage: number) => void;
    setReplayPlaying: (isReplayPlaying: boolean) => void;
}

export const useAnalyzerStore = create<AnalyzerData>((set) => ({
    currentShotIdx: -1,
    currentShot: null,
    shotExtras: [],
    replayPercentage: 0,
    isReplayPlaying: false,

    setCurrentShot: (currentShotIdx: number, shot: IScattShot) => set({currentShotIdx, currentShot: shot}),
    setShotExtras: (shotExtras: Array<IShotExtra>) => set({shotExtras}),
    setReplayPercentage: (replayPercentage: number) => set({replayPercentage}),
    setReplayPlaying: (isReplayPlaying: boolean) => set({isReplayPlaying}),
}));
