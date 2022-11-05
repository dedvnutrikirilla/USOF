import React from "react";
import styles from './TotalAuth.module.css'

const Submit = (props) => {
    return (
        <input className={styles.submit} type="submit" value={props.name}/>
    );
};

export default Submit;

