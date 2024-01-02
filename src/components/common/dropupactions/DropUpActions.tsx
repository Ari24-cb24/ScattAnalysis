import styles from "./dropup.module.css";
import React, {useCallback, useEffect, useRef, useState} from "react";


const DropUpActions = (props: {
    options: {[key: string]: (React.ReactNode | React.JSX.Element)};
    setSelectedOption: (option: string) => void;
    children: React.ReactNode | React.JSX.Element;
    className?: string;
}) => {
    const {options, setSelectedOption, children} = props;
    const [isExpanded, setIsExpanded] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = useCallback((e: MouseEvent) => {
        if (!isExpanded) return;
        if (e.target instanceof HTMLElement && !e.target.closest(`.${styles.wrapper}`)) {
            setIsExpanded(false);
        }
    }, [isExpanded]);

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        }
    }, [handleClick]);

    useEffect(() => {
        // Update the horizontal position of the options if the options are out of the viewport
        if (!isExpanded || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.right > windowWidth) {
            ref.current.style.left = windowWidth - rect.right + "px";
        }

        if (rect.left < 0) {
            ref.current.style.left = -rect.left + "px";
        }
    }, [isExpanded, ref]);

    return (
        <div className={`${styles.wrapper} ${props.className}`}>
            <div className={styles.selected_option} onClick={() => setIsExpanded((prev) => !prev)}>
                {children}
            </div>
            <div className={`${styles.options} ${isExpanded ? styles.options__show : undefined}`} ref={ref}>
                {Object.keys(options).map((option, idx) => (
                    <div
                        className={`${styles.option}`}
                        onClick={() => {
                            setSelectedOption(option);
                            setIsExpanded(false);
                        }}
                        key={idx}
                    >
                        {options[option]}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DropUpActions;
