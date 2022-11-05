import React from "react";
import MiniUser from './MiniUser.jsx';
import styles from './totalSide.module.css';

const SideBar = () => {
    return (
        //User infos
        <div className={styles.totalSide}>
            <MiniUser/>
        </div>
    );
};

export default SideBar;