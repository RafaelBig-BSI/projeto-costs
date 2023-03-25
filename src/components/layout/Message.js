import styles from './Message.module.css';

import { useState, useEffect } from 'react';

function Message({type, msg}){

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        if(!msg){
            setVisible(false);
            return;
        }

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000)

        return () => clearTimeout(timer)

    }, [msg]) //useEffect sempre deve estar ligado à alguem. Nesse caso, ele esta ligado à msg

    return(
        <>
            {
                visible && (
                    <div className={`${styles.message} ${styles[type]}`}>
                        {msg}
                    </div>
                )
            }
        </>
    )
}

export default Message;