import styles from "./ground.module.scss";
import React, {useEffect, useState} from "react";
import {fetchdraws} from "../api/mongo/ground"
import {Draws, FetchParams} from "@/app/api/backapi/types";
import Cover from "./cover";
import Image from 'next/image';
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import {Path} from "@/app/constant";
import {useNavigate} from "react-router-dom";
import {showToast} from "@/app/components/ui-lib";
import InfiniteScroll from "react-infinite-scroll-component";

export function Ground() {

    const navigate = useNavigate()
    const [draws, setDraws] = useState<Draws[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectDraw, setSelectDraw] = useState<Draws | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true)
    let limit = 20;

    useEffect(() => {
        const run = async () => {
            fetchdraws("", draws.length, limit).then((res) => {
                if (res && res.data.length === limit) {
                    setHasMore(true);
                    setDraws(res.data);
                    return;
                }
                if (res && res.data.length == 0){
                    setHasMore(false)
                    return;
                }
                if(res && res.data.length< limit){
                    setHasMore(false)
                    setDraws(res.data);
                    return;
                }
            })
        }
        run();
    }, []);

    const loadMore = async () => {
        fetchdraws("", draws.length, limit).then((res) => {
            if (res && res.data.length === limit) {
                setHasMore(true);
                setDraws((prevDraws) => [...prevDraws, ...res.data]);
                return;
            }
            if (res && res.data.length == 0){
                setHasMore(false)
                return;
            }
            if(res && res.data.length< limit){
                setHasMore(false)
                setDraws((prevDraws) => [...prevDraws, ...res.data]);
                return;
            }
        })
    }


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
            <div id="ground" className={styles["ground"]}>
                <Cover open={open} onClose={() => setOpen(false)} draw={selectDraw}/>
                <div className={styles["ground-container"]}>
                    <InfiniteScroll
                        dataLength={draws.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<span className={styles["load-more"]}>加载中...</span>}
                        scrollableTarget="ground"
                        className={styles["ground__draws-scroll"]}
                    >
                        <div className={styles["ground__draws"]}>
                            {draws?.map((item: FetchParams, index: number) => (
                                <div key={index} className={styles["ground__draw-content"]} onClick={() => {
                                    setSelectDraw(item);
                                    setOpen(true);
                                }}>
                                    <Image layout="fill" src={item.imageUrl} alt={item.id}
                                           className={styles["ground__draw-img"]}/>
                                    {/*<img src={draw.imageUrl} alt="" className={styles["ground__draw-img"]}/>*/}
                                    <div className={styles["ground__draw-info"]}>
                                        <div className={styles["ground__draw-info-content"]}>
                                            <span>{item.user_name?.substring(0, 3) + "******" + item.user_name?.substring(9)}</span>
                                            <p>{item.prompt.slice(0, 40)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </InfiniteScroll>
                    {!hasMore && (<span className={styles["load-more"]}>到底了...</span>)}
                </div>
            </div>
        </>
    )
}