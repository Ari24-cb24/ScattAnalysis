import styles from "./aside.module.css"
import Header from "./Header.tsx";
import Shot from "./Shot.tsx";
import {useAnalyzerStore} from "../../../stores/analyzerstore.ts";

const Aside = () => {
    const [meta, shots] = useAnalyzerStore((state) =>
        [state.meta, state.shots]);

    if (!meta || !shots) {
        return null;
    }

    return (
        <aside className={styles.aside}>
            <Header meta={meta} shots={shots} />
            <div className={styles.shots}>
                {shots.map((shot, index) => (
                    <Shot shot={shot} key={index} shotIdx={index} />
                ))}
            </div>
        </aside>
    )
}

export default Aside;
