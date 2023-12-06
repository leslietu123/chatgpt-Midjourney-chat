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
import {Box, Center, Container, Flex, Grid, Icon} from "@chakra-ui/react";
import Masonry from 'react-layout-masonry';
import {AddIcon} from "@chakra-ui/icons";
import {AiOutlineLike} from "react-icons/ai";
import {useMobileScreen} from "@/app/utils";
import {useAppConfig} from "@/app/store";
import {showToast} from "@/app/components/ui-lib";
import fileDownload from "js-file-download";

export function Ground() {
    const isMobileScreen = useMobileScreen();
    const theme = useAppConfig().theme;
    const navigate = useNavigate()
    const [draws, setDraws] = useState<drawRes[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectDraw, setSelectDraw] = useState<drawRes>({} as drawRes);
    const [hasMore, setHasMore] = useState(true)
    let limit = 20;
    const [page, setPage] = useState(1);
    const [downloading, setDownloading] = useState(false);

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

    const copyPromptClipboard = async (data:drawRes) => {
        try {
            await navigator.clipboard.writeText(data?.prompt || "");
            showToast("已复制到剪切板");
        } catch (err) {
            showToast("复制失败");
            console.error('复制失败: ', err);
        }
    };

    async function handleDownload(data:drawRes) {
        const url = data?.uri || "";
        setDownloading(true);
        showToast("下载中...")
        const response = await fetch(url);
        const blob = await response.blob();
        fileDownload(blob, 'image.png'); // or any other name you want
        setDownloading(false);
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
            <Cover open={open} onClose={() => setOpen(false)} onDrawImg={selectDraw}/>
            <Box overflowY={"auto"} overflowX={"hidden"} >
                <Masonry columns={{640: 2, 768: 3, 1024: 4, 1280: 5, 1600: 6}} gap={10} style={{
                    margin: "0 auto",
                    // overflowY: "auto",
                    // overflowX: "hidden",
                    width: "100%",
                    maxWidth: "1600px",
                    height: "100%",
                    padding: "20px 10px",
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
                                <Flex padding={1} className={styles['mItem-cover']}>
                                    <Flex padding={3} width="100%" justifyContent={"space-between"}>
                                        <Box fontWeight={900} color={'#fff'}
                                             fontSize={14}>{item.user && item.user.name ? item.user.name.substring(0, 3) + "***" + item.user.name.substring(9) : "匿名用户"}</Box>
                                        {/*<Icon as={AiOutlineLike} className="no-dark" width="20px" height="20px"*/}
                                        {/*      color="#ffffff"/>*/}
                                    </Flex>
                                    <Box width={"100%"} color={'#fff'} paddingX={3} fontWeight={500} fontSize={12}>
                                        {item.prompt ? item.prompt.slice(0, 40) : "暂无提示词"}
                                    </Box>
                                    <Flex gap={4} padding={3} width="100%" justifyContent={"space-between"}>
                                        <Center
                                            color={'#fff'}
                                            borderRadius={5}
                                            fontWeight={900}
                                            width={"100%"}
                                            background={'var(--ground-btn-bg)'}
                                            backdropFilter={'blur(10px)'}
                                            padding={2}
                                            fontSize={12}
                                            _hover={{
                                                background: 'var(--ground-btn-bg)',
                                                backdropFilter: 'blur(3px)',
                                            }}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await copyPromptClipboard(item);
                                            }}
                                        >
                                            复制
                                        </Center>
                                        <Center
                                            color={'#fff'}
                                            borderRadius={5}
                                            fontWeight={900}
                                            width={"100%"}
                                            background={'var(--ground-btn-bg)'}
                                            backdropFilter={'blur(10px)'}
                                            padding={2}
                                            fontSize={12}
                                            _hover={{
                                                background: 'var(--ground-btn-bg)',
                                                backdropFilter: 'blur(3px)',
                                            }}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleDownload(item);
                                            }}
                                        >
                                            下载
                                        </Center>
                                    </Flex>
                                </Flex>
                            </div>
                        );
                    })}
                </Masonry>
            </Box>

            <Center
                paddingY={5}
                bg="var(--bottom-bar)"
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

