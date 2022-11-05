import React from "react";
import styles from './Comment.module.css';
import { timeElapser } from "../../../utils/timeElapsed";


const Post = (obj) => {
    const commentParams = obj.props;
    const date = new Date(commentParams.publishDate).getTime();
    
    return (
        <div className={styles.com}>
            <span className={styles.publishDate}>{timeElapser(date)}</span>
            <div className={styles.content}>
                <p>{commentParams.content}</p>
            </div>
        </div>
    );
};

export default Post;