import {DraggableTitle, StretchBarConfig, TabsBarConfig} from "react-tile-pane";
import React from "react";
import styles from "./styles.module.css";
import {IconX} from "@tabler/icons-react";

export const tabBarConfig: (
    icons: Record<string, React.ReactNode>,
    names: Record<string, string>
) => TabsBarConfig = (icons, names) => ({
    render({ tabs, onTab, action }) {
        return (
            <div className={styles.tab_bar}>
                {tabs.map((tab, idx) => (
                    <DraggableTitle
                        name={tab}
                        className={[idx === onTab ? styles.active : null, styles.tab_wrapper].join(" ")}
                        key={tab}
                        onClick={() => action.switchTab(idx)}
                    >
                        <div className={styles.identifier}>
                            {icons[tab]}
                            <p className={styles.title}>{names[tab]}</p>
                        </div>
                        <div className={styles.close}>
                            <IconX onClick={() => action.closeTab(idx)} />
                        </div>
                    </DraggableTitle>
                ))}
            </div>
        )
    },
    thickness: 0,
    position: "top",
    preBox: {
        isRow: true,
        isReverse: false,
    }
});

export const stretchBar: StretchBarConfig = {
    className: styles.stretch_bar,
    style: (isRow) => ({
        cursor: isRow ? 'ew-resize' : 'ns-resize',
    }),
    position: "previous",
}

export const theme = (
    icons: Record<string, React.ReactNode>,
    names: Record<string, string>
) => ({
    tabBar: tabBarConfig(icons, names),
    stretchBar: stretchBar,
});
