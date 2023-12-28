import {IScattShot, ITrace} from "../../types/analyzer/scatt_document_types.ts";

export const TARGET_DIAMETER = 45.5;
export const TARGET_RADIUS = TARGET_DIAMETER / 2;
export const DIABOLO_SIZE = 4.5;
export const FPS = 120;
export const TIME_PER_FRAME = 1000 / FPS;

export const xOffset = (x: number, width: number) => {
    return ((x + TARGET_RADIUS) / TARGET_DIAMETER) * width;
}

export const yOffset = (y: number, height: number) => {
    return ((y + TARGET_RADIUS) / TARGET_DIAMETER) * height;
}

export const getDiaboloRadius = (width: number) => {
    return ((DIABOLO_SIZE / TARGET_DIAMETER) * width) / 2
}

export const absoluteTime = (shotTime: number, tRelative: number): number => {
    if (tRelative < 0) {
        return Math.abs(shotTime) - Math.abs(tRelative);
    } else {
        return Math.abs(shotTime) + tRelative;
    }
}

export const getShotDuration = (trace: Array<ITrace>): number => {
    if (trace.length === 0) return 0;
    return Math.abs(trace[trace.length - 1].t) + Math.abs(trace[0].t);
}

export const resetCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
}

export const getMaxFrames = (trace: Array<ITrace>): number => {
    const totalMillis = getShotDuration(trace);
    return Math.floor(totalMillis * FPS)
}

const getShotTraceIdx = (trace: Array<ITrace>) => {
    let shotTraceIdx = -1;

    for (let i = 0; i < trace.length; i++) {
        if (trace[i].t >= 0) {
            shotTraceIdx = i;
            break;
        }
    }

    return shotTraceIdx;
}

const drawTraces = (ctx: CanvasRenderingContext2D, traces: Array<ITrace>, width: number, height: number) => {
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 5;

    for (let i = 0; i < traces.length; i++) {
        const trace = traces[i];
        const x = xOffset(trace.x, width);
        const y = yOffset(trace.y, height);

        if (trace.t >= 0) {
            ctx.strokeStyle = "#FF0000";
        } else if (trace.t >= -1.0 && trace.t < -0.2) {
            ctx.strokeStyle = "#FFFF00";
        } else if (trace.t >= -0.2 && trace.t < 0) {
            ctx.strokeStyle = "#0000FF";
        }

        if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

const drawShot = (ctx: CanvasRenderingContext2D, shot: IScattShot, width: number, height: number) => {
    ctx.globalCompositeOperation = "destination-over";

    const translatedX = xOffset(shot.breach_x, width);
    const translatedY = yOffset(shot.breach_y, height);

    ctx.fillStyle = "#CCCCCC";
    ctx.beginPath();
    ctx.arc(translatedX, translatedY, getDiaboloRadius(width), 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
}

export const redrawAllFrames = (ctx: CanvasRenderingContext2D, shot: IScattShot, trace: Array<ITrace>, width: number, height: number, frame: number, isGoingBackwards: boolean) => {
    if (isGoingBackwards) {
        ctx.clearRect(0, 0, width, height);
    }

    const shotStart = trace[0].t;
    const elapsedMillis = frame * TIME_PER_FRAME;
    const traces = [];
    const shotTraceIdx = getShotTraceIdx(trace);

    for (let i = 0; i < trace.length; i++) {
        const absTime = absoluteTime(shotStart, trace[i].t) * 1000;

        if (i === shotTraceIdx) {
            drawShot(ctx, shot, width, height);
        }

        if (absTime <= elapsedMillis) {
            traces.push(trace[i]);
        } else {
            break;
        }
    }

    drawTraces(ctx, traces, width, height);
}

export const drawFrame = (ctx: CanvasRenderingContext2D, shot: IScattShot, trace: Array<ITrace>, width: number, height: number, frame: number) => {
    const shotStart = trace[0].t;
    const elapsedMillis = frame * TIME_PER_FRAME;
    const prevElapsedMillis = (frame - 1) * TIME_PER_FRAME;
    const shotTraceIdx = getShotTraceIdx(trace);

    const traces = [];
    let lastTraceIndex = -1;

    for (let i = 0; i < trace.length; i++) {
        const absTime = absoluteTime(shotStart, trace[i].t) * 1000;

        if (absTime >= elapsedMillis) {
            traces.push(trace[i]);
            lastTraceIndex = i;
            break;
        } else if (absTime >= prevElapsedMillis) {
            traces.push(trace[i]);
        }
    }

    if (lastTraceIndex === shotTraceIdx) {
        drawShot(ctx, shot, width, height);
    }

    drawTraces(ctx, traces, width, height);
}
