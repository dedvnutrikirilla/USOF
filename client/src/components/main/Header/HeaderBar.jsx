import React , { useEffect, useContext }from "react";
import styles from './HeaderBar.module.css';
import { AuthContext } from "../../../contexts/authContext";
import authHandler from "../../../API/authHandler";

const HeaderBar = () => {
    const {Authobj, setAuthObj} = useContext(AuthContext);

    useEffect(()=> {    
        
    }, [Authobj]);

    return (
        <header>
            <nav>
                <ul>
                    <li><a href='/'>Home</a></li>
                    {Authobj.login ? 
                    <div className={styles.authorized}>
                        <li><a href='/ask'>Ask</a></li>
                        <li className={styles.userName}>{Authobj.login}</li>
                        <li className={styles.login}><a href="#" onClick={authHandler.logout}>Log Out</a></li>
                    </div>
                    :
                    <div className={styles.authorized}>
                        <li><a href='/auth/login'>Ask</a></li> 
                        <li className={styles.login}><a href='/auth/login'>Login</a></li>
                        <li className={styles.register}><a href='/auth/register'>Sign-up</a></li>
                    </div>}
                </ul>
            </nav>
        </header>
    );
};

export default HeaderBar;