import {create} from "zustand";
import {IScattDocumentMeta, IScattShot, ITrace} from "../types/analyzer/scatt_document_types.ts";


interface AnalyzerData {
    currentShotIdx: number;
    meta: IScattDocumentMeta | null;
    shots: Array<IScattShot>;

    setCurrentShotIdx: (currentShotIdx: number) => void;
    setMeta: (meta: IScattDocumentMeta) => void;
    setShots: (shots: Array<IScattShot>) => void;
}

interface ReplayData {
    trace: Array<ITrace>;
    replayPercentage: number;
    isReplayPlaying: boolean;
    replaySpeed: number;

    setTrace: (trace: Array<ITrace>) => void;
    setReplayPercentage: (replayPercentage: number) => void;
    setReplayPlaying: (isReplayPlaying: boolean) => void;
    setReplaySpeed: (replaySpeed: number) => void;
}

export const useAnalyzerStore = create<AnalyzerData>((set) => ({
    currentShotIdx: -1,
    meta: null,
    shots: [],

    setCurrentShotIdx: (currentShotIdx: number) => set({currentShotIdx}),
    setMeta: (meta: IScattDocumentMeta) => set({meta}),
    setShots: (shots: Array<IScattShot>) => set({shots}),
}));

export const useReplayStore = create<ReplayData>((set) => ({
    trace: [],
    replayPercentage: 0,
    isReplayPlaying: false,
    replaySpeed: 1,

    setTrace: (trace: Array<ITrace>) => set({trace}),
    setReplayPercentage: (replayPercentage: number) => set({replayPercentage}),
    setReplayPlaying: (isReplayPlaying: boolean) => set({isReplayPlaying}),
    setReplaySpeed: (replaySpeed: number) => set({replaySpeed}),
}));
