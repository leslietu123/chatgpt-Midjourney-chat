import React, {ReactNode} from 'react';
import styles from './pop.module.scss';
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";

interface ModalProps {
    title: string;
    open: boolean;
    children?: JSX.Element;
    onClick?: () => void;
    content?: JSX.Element;
    buttonText?: string;
    hideClose?: boolean;
    onClose?: () => void;
    disabled?: boolean;
    hideButton?: boolean;
    subTitle?:string;
}

export default function PopUp(props: ModalProps) {
    if (!props.open) {
        return null;
    }
    return (
        <div className={styles["popup-container"]}>
            <div className={styles["popup-content"]}>
                <div className={styles["popup-header"]}>
                    <div className={styles["popup-header-info"]}>
                        <div className={styles["popup-header-info-title"]}>
                            <span>{props.title}</span>
                            {props.subTitle && (<p>{props?.subTitle}</p>)}
                        </div>
                        {props.hideClose ? null : (<IconButton onClick={props.onClose} icon={<CloseIcon />} />)}
                    </div>

                </div>
                <div id="popup-body" className={styles["popup-body"]}>
                    {props.content ? props.content : props.children}
                </div>
                {props.hideButton ? null : (
                    <div className={styles["popup-btn"]}>
                        <button disabled={props.disabled} onClick={props.onClick}>{props.buttonText}</button>
                    </div>
                )}
            </div>
        </div>
    )
}

