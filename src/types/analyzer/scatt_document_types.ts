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
    f_coefficient: string;
    enter_time: string;
    shot_time: string;
    result: number;
    breach_x: number;
    breach_y: number;
    trace: Array<ITrace>;
}

export interface ITrace {
    t: number;
    x: number;
    y: number;
}