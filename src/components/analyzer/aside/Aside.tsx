import {IScattDocumentMeta, IScattShot} from "../../../types/analyzer/scatt_document_types.ts";
import styles from "./aside.module.css"
import Header from "./Header.tsx";
import Shot from "./Shot.tsx";
import {useAnalyzerStore} from "../../../stores/analyzerstore.ts";

const Aside = (props: {
    meta: IScattDocumentMeta,
    shots: Array<IScattShot>
    onSelectShot: (shot: IScattShot) => void
}) => {
    const [shotExtras] = useAnalyzerStore((state) => [state.shotExtras]);

    return (
        <aside className={styles.aside}>
            <Header meta={props.meta} shotExtras={shotExtras} />
            <div className={styles.shots}>
                {props.shots.map((shot, index) => (
                    <Shot shot={shot} key={index} shotIdx={index} />
                ))}
            </div>
        </aside>
    )
}

export default Aside;