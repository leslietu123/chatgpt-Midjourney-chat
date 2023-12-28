import React, {useState} from 'react';
import {useMobileScreen} from "@/app/utils";
import styles from "./draw.module.scss";
import Image from 'next/image';
import Cover from "./cover";
import {drawRes} from "@/app/api/back/types";
import {Box, Progress} from '@chakra-ui/react';


interface DrawImgProps {
    src?: string;
    className?: string;
    loading?: boolean;
    progress?: string;
    onDrawImg?: drawRes;
}

export function DrawImg(props: DrawImgProps) {
    const isMobileScreen = useMobileScreen();
    let number = 0;
    if(props.progress){
        switch (props.progress) {
            case "done":
                number = 100;
                break;
            default:
                number = parseFloat(props.progress.replace('%', ''));
                break;
        }
    }
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading,setLoading]=useState(true)
    return (
        <>
            <Cover onDrawImg={props.onDrawImg} open={open} onClose={() => setOpen(false)}/>
            <div className={styles["draw-img-body"]}>
                {props.loading && (
                    <div className={styles["drawing-body"]}>
                        <img src="./loading.svg" alt=""/>
                        <span>绘图中...</span>
                    </div>
                )}
                <Box>
                    {loading && <div className={styles.loader}>Loading...</div>}
                    <Image
                        layout="fill"
                        src={props.onDrawImg?.url ? props.onDrawImg?.url : props.onDrawImg?.uri || "./no-found.png"}
                        alt={props.onDrawImg?.url ? props.onDrawImg?.url : props.onDrawImg?.uri || "no-found.png"}
                        className={styles["draw-img"]}
                        onClick={() => setOpen(true)}
                        onLoadingComplete={()=>setLoading(false)}
                    />
                </Box>

            </div>
            <Progress maxWidth={500} hasStripe value={number} width='100%' marginY={10}/>
        </>

    );
};
