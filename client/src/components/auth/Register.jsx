import React, { useState } from "react";
import InputClass from "../../utils/inputClass.js";
import LiInput from "./LiInput";
import AuthHandler from '../../API/authHandler.js';
import { useNavigate } from "react-router-dom";

import styles from './TotalAuth.module.css';

const Register = () => {
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
        else if(Password.value !== PasswordRepeat.value)
            PasswordRepeat.showError('Passwords dont match!', true);
        else if(!/^[a-zA-z ]*$/g.test(FullName.value))
            FullName.showError('Allowed symbols: \'Aa...Zz\', space.');
        else{
            const toSend = {
                login: Login.value,
                password: Password.value,
                fullName: FullName.value,
                email: Email.value
            }

            console.log(toSend)

            const response = await AuthHandler.register(toSend);
            if(response.name === 'AxiosError'){
                const message = response.response.data.message
                console.log(message)
                if(message === 'Login already exists')
                    Login.showError(message);
                else alert('Error: ' + message);
            }
            else {
                console.log(document.cookie);
                navigate('/auth/login');
            }
        }
    }

    const Login = new InputClass(useState(), useState(''), useState(false), 'Login', 'login', 'text');
    const Password = new InputClass(useState(), useState(''), useState(false), 'Password', 'password', 'password');
    const PasswordRepeat = new InputClass(useState(), useState(''), useState(false), 'Repeat password', 'passwordRepeat', 'password');
    const FullName = new InputClass(useState(), useState(''), useState(false), 'Full name', 'fullName', 'text');
    const Email = new InputClass(useState(), useState(''), useState(false), 'Email', 'email', 'email');

    return (
        <form>
            <h1>Register</h1>
            <ul>
                <LiInput props={Login}/>
                <LiInput props={Password}/>
                <LiInput props={PasswordRepeat}/>
                <LiInput props={FullName}/>
                <LiInput props={Email}/>
            </ul>  
            <button onClick={sendForm} className={styles.submit}>Register</button>
        </form>
        
    );
};

export default Register;