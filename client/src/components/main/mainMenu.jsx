import React from "react";
import { useEffect, useContext  } from "react";
import FooterBar from "./Footer/FooterBar";
import HeaderBar from "./Header/HeaderBar";
import SideBar from "./SideBar/SideBar";
import PostCreator from "./Posts/PostCreator";
import PostList from "./Posts/PostList.jsx";
import PostView from "./Posts/PostView";
import { AuthContext } from '../../contexts/authContext.js';
import userHandler from "../../API/userHandler";

import styles from './totalMain.module.css';

const MainMenu = (props) => {
    const {Authobj, setAuthObj} = useContext(AuthContext);

    useEffect(()=> {
        const cookiesArr = document.cookie.split(';');
        console.log(document.cookie);
        let login = '';
        cookiesArr.forEach(cookieStr =>{
            if (cookieStr.startsWith(' login=')){
                login = cookieStr.slice(7);
                return;
            }
        });
        if (login) userGetter(login)
    }, []);

    const userGetter = async(login) => {
        let user = ''
        if(login) user = await userHandler.getByLogin(login);
        console.log(login);
        console.log(user.data);
        setAuthObj(user.data);
        return user.dat
    }

    const defineElement = (element) => {
        switch (element) {
            case 'ask':
                return <PostCreator/>
            case 'viewPost':
                return <PostView/>
            default:
                return <PostList/>
        }
    }

    return (
        <div /*className={styles.min}*/>
            <HeaderBar/>
            <div>
                <SideBar/>
                <div className={styles.mainMain}>
                {
                    defineElement(props.element)
                }
                </div>
            </div>
            <FooterBar/>
        </div>
    );
};

export default MainMenu;