import {IScattDocumentMeta} from "../../../types/analyzer/scatt_document_types.ts";
import styles from "./header.module.css"
import {IconCalendarMonth, IconCircle, IconClock, IconViewfinder} from "@tabler/icons-react";

const Header = (props: {
    meta: IScattDocumentMeta
}) => {
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
                    <p>45 min</p>
                </div>
                <div className={styles.subgroup}>
                    <IconViewfinder />
                    <p>354 (381.3)</p>
                </div>
            </div>
        </div>
    )
}

export default Header;