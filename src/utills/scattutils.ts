import {absoluteTime, TIME_PER_FRAME} from "./shotcanvas/methods.ts";
import {IScattShot, ITrace} from "../types/analyzer/scatt_document_types.ts";
import {IVelocityList, IVelocityPoint} from "../types/analyzer/velocity_graph.ts";

export const getVelocityPoints = (velocityGraph: IVelocityList, shot: IScattShot, trace: Array<ITrace>, frame: number): Array<IVelocityPoint> => {
    const shotStart = velocityGraph[0].t;
    const elapsedMillis = frame * TIME_PER_FRAME;
    const points = [];

    for (let i = 0; i < velocityGraph.length; i++) {
        const absTime = absoluteTime(shotStart, velocityGraph[i].t) * 1000;

        if (absTime <= elapsedMillis) {
            points.push({
                t: velocityGraph[i].t,
                v: velocityGraph[i].v
            });
        } else {
            break;
        }
    }

    return points;
}
