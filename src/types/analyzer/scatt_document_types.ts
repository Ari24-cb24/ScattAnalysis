export interface IScattDocumentMeta {
    event_name: string;
    event_name_short: string;
    caliber: string;
    shooter: string;
    date: string;
    comments: string;
    rings: Array<number>;
}

export interface IScattShot {
    number: number;
    rings: number;
    rings_fraction: number;
    duration_millis: number;
    ave_speed: number;
    ave_speed_250ms: number;
    best_result_before: {
        delta_time: number;
        abs_time: number;
        result: number;
    }
    f_coefficient: string;
    enter_time: string;
    shot_time: string;
    // result: number;
    breach_x: number;
    breach_y: number;
}

export interface ITrace {
    t: number;
    x: number;
    y: number;
}
