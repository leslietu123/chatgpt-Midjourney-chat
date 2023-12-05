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
import {Center, Grid} from "@chakra-ui/react";
import Masonry from 'react-layout-masonry';
import {AddIcon} from "@chakra-ui/icons";


export function Ground() {

    const navigate = useNavigate()
    const [draws, setDraws] = useState<drawRes[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectDraw, setSelectDraw] = useState<drawRes>({} as drawRes);
    const [hasMore, setHasMore] = useState(true)
    let limit = 20;
    const [page, setPage] = useState(1);
    console.log(page)


    const fetchData = async (page: number, append: boolean = false) => {
        try {
            const res = await getGround(page);
            if (res && res.length === limit) {
                setHasMore(true);
                if (append) {
                    setDraws((prevDraws) => [...prevDraws, ...res]);
                } else {
                    setDraws(res);
                }
                setPage(prevPage => prevPage + 1);
            } else if (res && res.length === 0) {
                setHasMore(false);
            } else if (res && res.length < limit) {
                if (append) {
                    setDraws((prevDraws) => [...prevDraws, ...res]);
                } else {
                    setDraws(res);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to get data:', error);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    const fetchMoreItems = async (page: number) => {
        await fetchData(page, true);
    };


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

                <Masonry columns={{640: 2, 768: 3, 1024: 4, 1280: 5, 1600: 6}} gap={3} style={{
                    margin: "0 auto",
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: "100%",
                    height: "100%",
                    padding: "20px 10px"
                }}>
                    {draws.map((item, index) => {
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


            <Center
                paddingY={5}
                bg="linear-gradient(to bottom, rgba(0,0,0,0),rgba(0,0,0,1))"
                position={"absolute"}
                bottom={0}
                width="100%"
            >
                <IconButton
                    icon={<AddIcon/>}
                    onClick={() => fetchMoreItems(page)}
                    bordered
                    text={hasMore ? "加载更多" : "没有更多了"}
                    className={styles["ground__load-more"]}
                    disabled={!hasMore}
                />
            </Center>
        </>
    )
}

