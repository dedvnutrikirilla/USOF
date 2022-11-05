import React from "react";
import styles from './Post.module.css';
import { timeElapser } from "../../../utils/timeElapsed";
import { useState } from "react";
import { useEffect } from "react";

const Post = (obj) => {
    const postParams = obj.props;
    const date = new Date(postParams.publishDate).getTime();
    const [content, setContent] = useState(postParams.content);
    const href = '/post/' + postParams.id;
    useEffect(()=> {
        if(postParams.content.length > 200){
            setContent(postParams.content.slice(0, 200) + '...');
        }
    }, []);
    
    return (
        <a href={href}>
            <div className={styles.post}>
                <div className={styles.title}>{postParams.title}</div>
                <span className={styles.publishDate}>{timeElapser(date)}</span>
                <div className={styles.content}>
                    <p>{content}</p>
                </div>
            </div>
        </a>
    );
};

export default Post;