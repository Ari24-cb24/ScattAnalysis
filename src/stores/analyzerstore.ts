import {create} from "zustand";
import {IScattDocumentMeta, IScattShot, ITrace} from "../types/analyzer/scatt_document_types.ts";
import {IVelocityList} from "../types/analyzer/velocity_graph.ts";


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
    frameIdx: number;

    setTrace: (trace: Array<ITrace>) => void;
    setReplayPercentage: (replayPercentage: number) => void;
    setReplayPlaying: (isReplayPlaying: boolean) => void;
    setReplaySpeed: (replaySpeed: number) => void;
    setFrameIdx: (frameIdx: number) => void;
}

interface VelocityGraphData {
    velocityGraph: IVelocityList;

    setVelocityGraph: (velocityGraph: IVelocityList) => void;
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
    frameIdx: 0,

    setTrace: (trace: Array<ITrace>) => set({trace}),
    setReplayPercentage: (replayPercentage: number) => set({replayPercentage}),
    setReplayPlaying: (isReplayPlaying: boolean) => set({isReplayPlaying}),
    setReplaySpeed: (replaySpeed: number) => set({replaySpeed}),
    setFrameIdx: (frameIdx: number) => set({frameIdx}),
}));

export const useVelocityGraphStore = create<VelocityGraphData>((set) => ({
    velocityGraph: [],

    setVelocityGraph: (velocityGraph: IVelocityList) => set({velocityGraph}),
}));
