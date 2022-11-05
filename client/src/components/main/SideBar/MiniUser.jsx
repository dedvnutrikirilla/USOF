import React from "react";
import { useEffect, useContext } from "react";
import { AuthContext } from '../../../contexts/authContext.js';
import userHandler from "../../../API/userHandler.js";
import styles from './totalSide.module.css'

const MiniUser = () => {
    const {Authobj, setAuthObj} = useContext(AuthContext);
    const avatarURL = 'http://localhost:3000/api/users/avatar/' + Authobj.profilePic;
    useEffect(()=> {    
        userHandler.getAvatar(Authobj.profilePic);
    }, [Authobj]);
    
    return (
        //User infos
        <div className={styles.miniUser}>
            {Authobj.login ? 
            <a href="#">
                <img className={styles.profilePic} src={avatarURL}></img>
                <p className={styles.login}>{Authobj.login}</p>
                <p className={styles.rating}>{Authobj.socialCredit}</p>
            </a> 
            : 
            <a href="/auth/login">
                <div className={styles.profilePic}></div>
                <p className={styles.login}>Unathorized</p>
            </a>}
        </div>
    );
};

export default MiniUser;