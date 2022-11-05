import React from "react";
import github from '../../../images/github.svg';
import mail from '../../../images/envelope-regular.svg';
import telegram from '../../../images/telegram.svg';
import line from '../../../images/line.svg';

import styles from './FooterBar.module.css'

const FooterBar = () => {
    return (
        <footer>
            <div className={`${styles.contactIcons} ${styles.footChunk}`}>
                <p>Our contacts:</p>
                <ul>
                    <li><a href="https://github.com/dedvnutrikirilla"><img src={github} alt="gitHub"/></a></li>
                    <li><a href="mailto:deds_dev_xye.coc.interactive@ukr.net"><img src={mail} alt="Mail"/></a></li>
                    <li><a href="https://t.me/dedvnutrikirilla"><img src={telegram} alt="Telega"/></a></li>
                    <li><a href="/#"><img src={line} alt="Line"/></a></li>
                </ul>
            </div>
            
            <div className={`${styles.infos} ${styles.footChunk}`}>
                <p>Ucode SOF, you all know which site we are talking about...</p>
            </div>

            <div className={`${styles.footNav} ${styles.footChunk}`}>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/#">About Us</a></li>
                    <li><a href="/#">Terms Policy</a></li>
                </ul>
            </div>

            <div className={`${styles.abouter} ${styles.footChunk}`}>
                <p>Contacts:</p>
                <ul>
                    <li>tel: (+380)66-026-2513</li>
                    <li>mail: deds_dev_xye.coc.interactive@ukr.net</li>
                    <li>Havanna Road, Одеса, Одеська область, 65000</li>
                </ul>
            </div>
        </footer>
    );
};

export default FooterBar;