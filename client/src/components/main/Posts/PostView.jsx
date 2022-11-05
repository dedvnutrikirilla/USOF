import React from "react";
import { useState, useEffect } from "react";
import {useFetch} from '../../../utils/customFetch.js';
import postHandler from "../../../API/postHandler";
import { useParams } from 'react-router-dom';
import { timeElapser } from "../../../utils/timeElapsed.js";
import Comment from '../Comment/Comment.jsx'

import styles from './Post.module.css';

const PostView = () => {
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const { postId } = useParams();
    const date = new Date(post.publishDate).getTime();
    
    const [postFetcher, isLoading, Error] = useFetch(async(id)=> {
        const replyPost = await postHandler.get(id);;
        setPost(replyPost.data);
        const replyComments = await postHandler.getComments(id);
        console.log(replyComments);
        setComments(replyComments.data)
    });

    useEffect(() => {
        if (!isNaN(postId)) postFetcher(postId);
    }, [])
    

    return (
        <div className={styles.PostView}>
            <div className={styles.post}>
                <div className={styles.title}>{post.title}</div>
                <span className={styles.publishDate}>{timeElapser(date)}</span>
                <div className={styles.content}>
                    <p>{post.content}</p>
                </div>
            </div>
            <div className={styles.PostComments}>
                {comments.map(element => {
                    return <Comment key={element.id} props={element}/>
                })}
            </div>

            <button className={styles.addComment}>Comment</button>
        </div>
    );
};

export default PostView;