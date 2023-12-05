import styles from "./ground.module.scss";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {fetchdraws} from "../api/mongo/ground"
import {Draws, FetchParams} from "@/app/api/backapi/types";
import Cover from "./cover";
import Image from 'next/image';
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import {Path} from "@/app/constant";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {getGround} from "@/app/api/back/mj";
import {drawRes} from "@/app/api/back/types";
import {Grid} from "@chakra-ui/react";
import Masonry from 'react-layout-masonry';


export function Ground() {

    const navigate = useNavigate()
    const [draws, setDraws] = useState<drawRes[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectDraw, setSelectDraw] = useState<drawRes>({} as drawRes);
    const [hasMore, setHasMore] = useState(true)
    // let limit = 20;
    const [page, setPage] = useState(1);
console.log(page)


    useEffect(() => {
        const run = async () => {
            getGround(page).then((res) => {
                setDraws(res);
                setPage(page + 1);
                // if (res && res.data.length === limit) {
                //     setHasMore(true);
                //     setDraws(res.data);
                //     return;
                // }
                // if (res && res.data.length == 0){
                //     setHasMore(false)
                //     return;
                // }
                // if(res && res.data.length< limit){
                //     setHasMore(false)
                //     setDraws(res.data);
                //     return;
                // }
            })
        }
        run();
    }, []);

    // const loadMore = async () => {
    //     fetchdraws("", draws.length, limit).then((res) => {
    //         if (res && res.data.length === limit) {
    //             setHasMore(true);
    //             setDraws((prevDraws) => [...prevDraws, ...res.data]);
    //             return;
    //         }
    //         if (res && res.data.length == 0) {
    //             setHasMore(false)
    //             return;
    //         }
    //         if (res && res.data.length < limit) {
    //             setHasMore(false)
    //             setDraws((prevDraws) => [...prevDraws, ...res.data]);
    //             return;
    //         }
    //     })
    // }

    const fetchMoreItems = async (page:number) => {
        getGround(page).then((res) => {
            setDraws((prevDraws) => [...prevDraws, ...res]);
            setPage(page + 1);
        });
    };

    const settingColumns = useCallback(() => {
        if(window.innerWidth >= 1400) return 4
        if(window.innerWidth >= 800) return 3
        if(window.innerWidth >= 500) return 2
        return 1
    }, [])

    const [column, setColumn] = useState(() => settingColumns())



    return (
        <>
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        绘画广场
                    </div>
                    <div className="window-header-sub-title">
                        @免费下载，可商用
                    </div>
                </div>

                <div className="window-actions">

                    <div className="window-action-button">
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={() => navigate(Path.Home)}
                            bordered
                        />
                    </div>
                </div>
            </div>
            <Cover open={open} onClose={() => setOpen(false)} onDrawImg={selectDraw}/>

            <Masonry columns={{ 640: 2, 768: 3, 1024: 4,1280:5, 1600: 6 }} gap={2} style={{
                margin: "0 auto",
                overflowY: "auto",
                overflowX: "hidden",
                width: "100%",
                height: "100%",
                padding: "20px 10px"
            }}>
                {draws.map((item,index) => {
                    return (
                        <div key={item._id} className={styles['mItem']} onClick={() => {
                            setSelectDraw(item);
                            setOpen(true);
                        }}>
                            <Image key={index} layout="fill" src={item.uri} alt={item._id}
                                   className={styles["ground__draw-img"]}
                            />
                        </div>
                    );
                })}
            </Masonry>
        </>
    )
}

