import React, { useState } from "react";
import InputClass from "../../../utils/inputClass";
import LiInput from "../../auth/LiInput";
import SpanError from "../../auth/SpanError";
import postHandler from "../../../API/postHandler";
import { useNavigate } from "react-router-dom";

import styles from './postCreator.module.css';

const PostCreator = () => {
    const navigate = useNavigate();
    const sendForm = async (event) => {
        event.preventDefault();
        if(Title.value.length < 5)
            Title.showError('Too small title!');
        else if(Content.value.length < 10)
            Content.showError('Too small content!');
        else{
            const toSend = {
                title: Title.value,
                content: Content.value,
            }
            const response = await postHandler.new(toSend);
            console.log(response);
            if(response.name === 'AxiosError'){
                const message = response.response.data.message
                console.log(message)
                switch (message) {
                    case 'Token screwed up':
                        alert('Error: ' + message);
                        navigate('/auth/login');
                        break;
                    case 'Bad Category Id':
                    default:
                        alert('Error: ' + message);
                        break;
                }
                //window.location.reload(false);
            }
            else {
                console.log('noError');
            }
            
        }
    }

    const Title = new InputClass(useState(''), useState(''), useState(false), 'Title', 'title', 'text');
    const Content = new InputClass(useState(''), useState(''), useState(false), 'Content', 'content', 'text');

    return (
        <form className={styles.postCreator}>
            <h3>Ask a question</h3>
            <ul>
                <LiInput props={Title}/>
                <li id={Content.name}>
                    <label htmlFor={Content.name}>{Content.label}:</label>
                    <textarea onChange={Content.onChange} name={Content.name} value={Content.value} rows="5" required></textarea>
                    {Content.isError && <SpanError errorValue={Content.errorValue}/>}
                </li>
            </ul>  
            <button onClick={sendForm} className={styles.submit}>Post</button>
        </form>
    );
};

export default PostCreator;