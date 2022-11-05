import React from "react";
import { useState, useEffect } from "react";
import {useFetch} from '../../../utils/customFetch.js';
import postHandler from "../../../API/postHandler";
import Post from "./Post.jsx";
import { useParams } from 'react-router-dom';

import styles from '../totalMain.module.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const { chunk } = useParams();
    const [postFetcher, isLoading, Error] = useFetch(async(chunk = 1)=> {
        const reply = await postHandler.getAll(chunk);
        console.log('LOG: fetch reply: ' + reply.data);
        setPosts(reply.data) 
    });

    useEffect(() => {
        postFetcher(chunk);
    }, [])
    

    return (
        <div className={styles.postList}>
            {posts.map(element => {
                return <Post key={element.id} props={element}/>
            })}
            <div className={styles.postNav}>
                <div><a href="/1">1</a></div>
                <div><a href="/2">2</a></div>
            </div>
        </div>
        
    );
};

export default PostList;