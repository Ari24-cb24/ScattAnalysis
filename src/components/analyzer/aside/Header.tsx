import {IScattDocumentMeta, IScattShot} from "../../../types/analyzer/scatt_document_types.ts";
import styles from "./header.module.css"
import {IconCalendarMonth, IconCircle, IconClock, IconViewfinder} from "@tabler/icons-react";
import {useMemo} from "react";
import {formatMillisToMinSec} from "../../../utills/jsutils.ts";

const Header = (props: {
    meta: IScattDocumentMeta;
    shots: Array<IScattShot>;
}) => {
    const totalTimeFormatted = useMemo(() => {
        let total = 0;

        props.shots.forEach((shot) => {
            total += shot.duration_millis;
        })

        return formatMillisToMinSec(total);
    }, [props.shots]);

    const totalRings = useMemo(() => {
        let rings = 0;
        let fractionRings = 0;

        props.shots.forEach((shot) => {
            fractionRings += shot.rings_fraction;
            rings += shot.rings;
        })

        return [rings, fractionRings.toFixed(1)];
    }, [props.shots]);

    return (
        <div className={styles.header}>
            <h6>{props.meta.shooter}</h6>
            <div className={styles.separator} />
            <div className={styles.group}>
                <div className={styles.subgroup}>
                    <IconCalendarMonth />
                    <p>{props.meta.date.split(" ")[0]}</p>
                </div>
                <div className={styles.subgroup}>
                    <IconCircle />
                    <p>{props.meta.rings.length}</p>
                </div>
                <div className={styles.subgroup}>
                    <IconClock />
                    <p>{totalTimeFormatted} min</p>
                </div>
                <div className={styles.subgroup}>
                    <IconViewfinder />
                    <p>{totalRings[0]} ({totalRings[1]})</p>
                </div>
            </div>
        </div>
    )
}

export default Header;
