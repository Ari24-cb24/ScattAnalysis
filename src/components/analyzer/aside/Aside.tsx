import {IScattDocumentMeta, IScattShot} from "../../../types/analyzer/scatt_document_types.ts";
import styles from "./aside.module.css"
import Header from "./Header.tsx";
import Shot from "./Shot.tsx";

const Aside = (props: {
    meta: IScattDocumentMeta,
    shots: Array<IScattShot>
    onSelectShot: (shot: IScattShot) => void
}) => {
    return (
        <aside className={styles.aside}>
            <Header meta={props.meta} />
            <div className={styles.shots}>
                {props.shots.map((shot, index) => (
                    <Shot shot={shot} key={index} shotIdx={index} />
                ))}
            </div>
        </aside>
    )
}

export default Aside;