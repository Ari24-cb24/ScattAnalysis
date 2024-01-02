import styles from "./dropup.module.css";
import {useCallback, useEffect, useState} from "react";


const DropUp = (props: {
    options: string[];
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    className?: string;
}) => {
    const {options, selectedOption, setSelectedOption} = props;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = useCallback((e: MouseEvent) => {
        if (!isExpanded) return;
        if (e.target instanceof HTMLElement && !e.target.closest(`.${styles.wrapper}`)) {
            setIsExpanded(false);
        }
    }, [isExpanded]);

    useEffect(() => {
        // document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        }
    }, [handleClick]);

    return (
        <div className={`${styles.wrapper} ${props.className}`}>
            <div className={styles.selected_option} onClick={() => setIsExpanded((prev) => !prev)}>
                {selectedOption}
            </div>
            <div className={`${styles.options} ${isExpanded ? styles.options__show : undefined}`}>
                {options.map((option, idx) => (
                    <div
                        className={`${styles.option} ${option === selectedOption ? styles.option__selected : ""}`}
                        onClick={() => {
                            setSelectedOption(option);
                            setIsExpanded(false);
                        }}
                        key={idx}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DropUp;
