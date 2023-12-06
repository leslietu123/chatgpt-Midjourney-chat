import styles from "./cover.module.scss";
import {IconButton} from "@/app/components/button";
import React, {useState} from "react";
import CloseIcon from "../icons/close.svg";
import InfoIcon from "../icons/eye.svg";
import CopyIcon from "@/app/icons/copy.svg";
import {ChatAction} from "@/app/components/chat";
import {showToast} from "@/app/components/ui-lib";
import DownLoadIcon from "@/app/icons/download.svg";
import fileDownload from 'js-file-download';
import ImgViewer from "@/app/components/img-viewer";
import {useMobileScreen} from "@/app/utils";
import PopUp from "@/app/components/pop";
import {drawRes} from "@/app/api/back/types";

// import Image from 'next/image';

interface CoverProps {
    title?: string;
    description?: string;
    onClose?: () => void;
    open?: boolean;
    onDrawImg?: drawRes;
}

export default function Cover(props: CoverProps) {
    const [downloading, setDownloading] = useState(false);
    const isMobileScreen = useMobileScreen();
    const [open, setOpen] = useState(false);

    const copyPromptClipboard = async () => {
        try {
            await navigator.clipboard.writeText(props.onDrawImg?.prompt || "");
            showToast("已复制到剪切板");
        } catch (err) {
            showToast("复制失败");
            console.error('复制失败: ', err);
        }
    };


    async function handleDownload() {
        const url = props.onDrawImg?.uri || "";
        setDownloading(true);
        showToast("下载中...")
        const response = await fetch(url);
        const blob = await response.blob();
        fileDownload(blob, 'image.png'); // or any other name you want
        setDownloading(false);
    }

    if (!props.open) {
        return null;
    }


    return (
        <div className={styles["cover"]}>
            <PopUp title="图像详情" open={open} onClick={() => setOpen(false)}
                   buttonText="我知道了" onClose={() => setOpen(false)}>
                <div className={styles["cover-content-info-content"]}>
                    <div className={styles["cover-content-info-prompt"]}>
                        <div className={styles["cover-content-info-action"]}>
                            <h5>原提示词：</h5>
                            <ChatAction text="" icon={<CopyIcon/>} style={{marginTop: "3px"}}
                                        onClick={copyPromptClipboard}/>
                        </div>
                        <span>{props.onDrawImg?.content}</span>
                    </div>
                    <div className={styles["cover-content-user-info"]}>
                        <span>{"#" + props.onDrawImg?.user?.name.substring(0, 3) + "******" + props.onDrawImg?.user?.name?.substring(9)}</span>
                        <span>{props.onDrawImg?.created_at ? new Date(parseFloat(String(props.onDrawImg?.created_at))).toLocaleString() : ""}</span>
                    </div>
                </div>
            </PopUp>
            {isMobileScreen ? (
                <div className={styles["close-mobile"]}>
                    <IconButton
                        icon={<InfoIcon/>}
                        onClick={()=> setOpen(true)}
                        // onClick={handleCheckout}
                        bordered
                    />
                    <IconButton
                        icon={downloading ? <>...</> : <DownLoadIcon/>}
                        onClick={handleDownload}
                        bordered
                    />
                    <IconButton
                        icon={<CloseIcon/>}
                        onClick={props.onClose}
                        // onClick={handleCheckout}
                        bordered
                    />
                </div>
            ):(
                <div className={styles["close"]}>
                    <IconButton
                        icon={<CloseIcon/>}
                        onClick={props.onClose}
                        // onClick={handleCheckout}
                        bordered
                    />
                </div>
            )}

            <div className={styles["cover-container"]}>
                <div className={styles["cover-content"]}>
                    <div className={styles["cover-content-img"]}>
                        <div className={styles["cover-content-img-content"]}>

                            {/*<img className={styles["cover-content-image"]}  src={props.draw?.imageUrl ? props.draw.imageUrl : "" } alt=""/>*/}
                            <ImgViewer onDrawImg={props.onDrawImg}/>
                        </div>

                    </div>
                    <div className={`${styles["cover-content-info"]} ${isMobileScreen ? styles["cover-content-info-mobile"]:""}`}>
                        <div className={styles["cover-content-info-content"]}>
                            <div className={styles["cover-content-info-prompt"]}>
                                <div className={styles["cover-content-info-action"]}>
                                    <h5>原提示词：</h5>
                                    <ChatAction text="" icon={<CopyIcon/>} style={{marginTop: "3px"}}
                                                onClick={copyPromptClipboard}/>
                                </div>
                                <span>{props.onDrawImg?.prompt}</span>
                            </div>
                            <div className={styles["cover-content-user-info"]}>
                                <span>{"#" + props.onDrawImg?.user?.name.substring(0, 3) + "***" + props.onDrawImg?.user?.name.substring(9)}</span>
                                <span>{props.onDrawImg?.created_at ? new Date(parseFloat(String(props.onDrawImg?.created_at))).toLocaleString() : ""}</span>
                            </div>
                        </div>

                        <div className={styles["cover-content-action"]}>
                            <div className={styles["cover-content-action-item"]}>
                                <IconButton
                                    icon={<DownLoadIcon/>}
                                    onClick={handleDownload}
                                    title="下载到本地"
                                    text={downloading ? "下载中..." : "下载到本地"}
                                    // onClick={handleCheckout}
                                    bordered
                                    className={styles["cover-content-action-item-download"]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}