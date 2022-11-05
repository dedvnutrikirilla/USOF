import React from "react";
import styles from './TotalAuth.module.css'

const SpanError = (props) => {
    console.log(props)
    return (
        <span className={styles.error}>{props.errorValue}</span>
    );
};

export default SpanError;