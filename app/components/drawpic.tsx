import React from 'react';
import {Space, Progress} from 'antd';
import {useMobileScreen} from "@/app/utils";
import styles from "./draw.module.scss";
import Image from 'next/image';
import Cover from "./cover";
import {Draws} from "@/app/api/backapi/types";


interface DrawImgProps {
    src?: string;
    className?: string;
    loading?: boolean;
    progress?: string;
    draw?: Draws;
}

export function DrawImg(props: DrawImgProps) {
    const isMobileScreen = useMobileScreen();
    console.log(props.draw?.imageUrl);
    let number = 0; // default value
    if (props.progress) {
        number = parseFloat(props.progress.replace('%', ''));
    }
    const [open, setOpen] = React.useState<boolean>(false);


    return (
        <>
            <Cover draw={props.draw} open={open} onClose={()=>setOpen(false)}/>
            <div className={styles["draw-img-body"]}>
                {props.loading && (
                    <div className={styles["drawing-body"]}>
                        <img src="./loading.gif" alt=""/>
                        <span>绘画中...</span>
                    </div>
                )}
                <Image
                    layout="fill"
                    src={props.draw?.imageUrl ? props.draw?.imageUrl : "/no-found.png"}
                    alt={props.draw?.imageUrl ? props.draw?.imageUrl : "/no-found.png"}
                    className={styles["draw-img"]}
                    onClick={()=> setOpen(true)}
                />

            </div>
            {/*{props.progress && props.progress !== "100%" && <Progress showInfo={false} style={{width:"80%" ,maxWidth:"500px"}} percent={number}/>}*/}
            <Progress className={styles["draw-img-progress"]} showInfo={true}
                      style={{width: "80%", maxWidth: "250px", marginInlineEnd: "0px"}} percent={number}/>
        </>

    );
};
