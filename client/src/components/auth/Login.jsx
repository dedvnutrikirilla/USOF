import React, { useState } from "react";
import InputClass from "../../utils/inputClass.js";
import LiInput from "./LiInput";
import AuthHandler from '../../API/authHandler.js';
import { useNavigate } from "react-router-dom";

import styles from './TotalAuth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const sendForm = async (event) => {
        event.preventDefault();
        if(!/^[a-zA-z0-9_ ]*$/g.test(Login.value))
            Login.showError('Allowed symbols: \'Aa...Zz\', \'_\', numbers, space.');
        else if(Login.value.length < 5)
            Login.showError('Login length should be longer than 4 symbols!');
        else if(/['"$%^@*&\\/|]/.test(Password.value))
            Password.showError('Unexpected symbol!', true);
        else if(Password.value.length < 6)
            Password.showError('Password length should be longer than 5 symbols!');
        else{
            const toSend = {
                login: Login.value,
                password: Password.value,
            }
            const response = await AuthHandler.login(toSend);
            if(response.name === 'AxiosError'){
                const message = response.response.data.message
                console.log(message)
                if(message === 'Login not found')
                    Login.showError(message);
                else if(message === 'Passwords don\'t match')
                    Password.showError(message, true);
                else alert('Error: ' + message); 
            }
            else {
                console.log(document.cookie);
                navigate('/');
            }
            
        }
    }

    const Login = new InputClass(useState(''), useState(''), useState(false), 'Login', 'login', 'text');
    const Password = new InputClass(useState(''), useState(''), useState(false), 'Password', 'password', 'password');

    return (
        <form>
            <h1>Login</h1>
            <ul>
                <LiInput props={Login}/>
                <LiInput props={Password}/>
            </ul>  
            <button onClick={sendForm} className={styles.submit}>Login</button>
        </form>
    );
};

export default Login;
