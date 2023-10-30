import styles from "./draw.module.scss";
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import AddIcon from "@/app/icons/add.svg";
import ShareIcon from "@/app/icons/share.svg";
import {Path} from "@/app/constant";
import React, {useEffect, useState} from "react";
import {ErrorBoundary} from "./error";
import {useNavigate} from "react-router-dom";
import {useMobileScreen} from "@/app/utils";
import Popup from "./pop";
import {showToast,showConfirm} from "@/app/components/ui-lib";
import {DrawImg} from "./drawpic"
import {isLogin, fetchUserInfo} from "@/app/api/backapi/user";
import ImageUploader from "./draw-imageuploader";
import InfiniteScroll from "react-infinite-scroll-component";
import {models, sizes, qualities, versions, U, V} from "../api/backapi/static";
import {
    ImagineParams,
    FetchParams,
    ChangeParams,
    BlendParams,
    itemUV,
    User,
    CheckoutRes, CheckoutParams, CheckPointsParams
} from "../api/backapi/types";
import {imagine, fetch, change, blend} from "../api/backapi/midjourney";
import {useAppConfig} from "@/app/store";
import {Checkout, CheckPoints} from "../api/backapi/checkout";
import {fetchdraws, send} from "../api/mongo/ground";
import Image from 'next/image';
import { Input } from 'antd';

const { TextArea } = Input;


export function Draw() {
    const theme = useAppConfig().theme;
    const navigate = useNavigate();
    const islogin = isLogin();
    const isMobileScreen = useMobileScreen();
    const userToken = localStorage.getItem("user_token");
    // const drawList = localData ? JSON.parse(localData) : [];
    const [userInfo, setUserInfo] = useState({} as User);
    const [active, setActive] = React.useState(0);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [inputContent, setInputContent] = React.useState("");
    const [selectedModel, setSelectedModel] = React.useState(models[0]);
    const [selectedSize, setSelectedSize] = React.useState(sizes[0]);
    const [quality, setQuality] = React.useState(qualities[1]);
    const [version, setVersion] = React.useState(versions[3]);
    const [inputValue, setInputValue] = React.useState(0);
    const [drawImg, setDrawImg] = React.useState({} as FetchParams);
    const [drawing, setDrawing] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [parentImages, setParentImages] = useState<string[]>([]);
    const [loadedImages, setLoadedImages] = useState(5);
    const [drawList, setDrawList] = useState<FetchParams []>([] as FetchParams [])
    const [hasMore, setHasMore] = useState(true)
    let limit = 10;


    useEffect(() => {
        const run = (user_id:string) => {
            fetchdraws(user_id, drawList.length, limit).then((res) => {
                if (res.data.length == 0) {
                    setHasMore(false);
                    return;
                } else if (res.data.length == limit) {
                    setDrawList(res.data); // 追加新数据到 draws 数组
                    setHasMore(true);
                    return;
                } else {
                    setDrawList(res.data);
                    setHasMore(false);
                    return;
                }
            })
        }

        if (userToken && userToken !== "") {
            fetchUserInfo().then(r => {
                setUserInfo(r)
                if (Object.keys(r).length !== 0 && r.id !== null) {
                    run(r.id.toString());
                }
            });
        }else{
            setHasMore(false);
            return
        }
    }, []);

    const handleUpload = (uploadedImages: string[]) => {
        setParentImages(uploadedImages);
    };

    const handleInput = (event: any) => {
        let value = Math.round(event.target.value);
        if (value > 100) {
            value = 100;
        }
        setInputValue(value);
    };
    const handleAction = async (actionType: string, data?: itemUV) => {
        if (!islogin) {
            showToast("请先登录");
            navigate(Path.SignUp);
            return;
        }

        if (!userInfo || Object.keys(userInfo).length === 0) {
            fetchUser();
            return;
        }

        if (actionType === 'imagine' && inputContent === "") {
            showToast("请输入描述");
            return;
        }

        if (actionType === 'blend' && parentImages.length < 1) {
            showToast("请先上传图片");
            return;
        }

        try {
            setSubmitting(true);
            const checkpointsData: CheckPointsParams = {
                user_email: userInfo.email,
                user_id: userInfo.id.toString(),
                action: "2",
                type: data?.action,
            };

            const res = await CheckPoints(checkpointsData);

            if (!res || !res.success) {
                setSubmitting(false);
                showToast(res && res.message ? res.message : "提交失败");
                if (res && res.message === "积分余额不足") {
                    navigate(Path.BuyPoints)
                    return;
                }
                setSubmitting(false);
                return;
            }
            const transaction_id = res.transaction_id;
            const prompt = `${inputContent} ${selectedModel.model} --ar ${selectedSize.name} --chaos ${inputValue}`;
            const imagineData: ImagineParams = {
                prompt,
            };
            const blendData: BlendParams = {
                base64Array: parentImages,
            };
            const changeData: ChangeParams = {
                index: data?.index,
                taskId: drawImg.id,
                action: data?.action,
            };


            let resData;
            switch (actionType) {
                case 'imagine':
                    resData = await imagine(imagineData);
                    break;
                case 'change':
                    resData = await change(changeData);
                    break;
                case 'blend':
                    resData = await blend(blendData);
                    break;
                default:
                    throw new Error("Invalid action type");
            }

            if (resData.data.code === 1) {
                setShowSidebar(false);
                setSubmitting(false);
                showToast("提交成功");
                const id = resData.data.result;
                fetchProgress(typeof id === "string" ? id : "", transaction_id, data?.action);
            } else {
                setSubmitting(false);
                showToast(resData.data.description);
            }
        } catch (error) {
            console.log(error);
            showToast("操作失败");
            setSubmitting(false)
        }
    };


    const fetchProgress = (id: string, transaction_id: string | undefined, type?: string) => {
        setDrawing(true);
        try {
            fetch(id).then(async (res) => {
                const newData = {...res.data, transaction_id: transaction_id ? transaction_id : ""};
                setDrawImg(newData);
                let data = JSON.parse(localStorage.getItem("drawingData") || "[]");
                let index = data.findIndex((item: { id: string; }) => item.id === res.data.id);
                if (index !== -1) {
                    data[index] = {id: res.data.id, data: newData};
                } else {
                    data.push({id: res.data.id, data: newData});
                }
                localStorage.setItem("drawingData", JSON.stringify(data));
                if (res.data.progress !== "100%" && res.data.status !== "SUCCESS") {
                    setTimeout(() => {
                        fetchProgress(id, transaction_id, type);
                    }, 2000);
                }
                if (res.data.progress === "100%" && res.data.status === "SUCCESS") {
                    setDrawing(false);
                    showToast("绘画完成");
                    res.data.user_id = userInfo.id.toString();
                    res.data.user_name = userInfo.username;
                    res.data.shared = false;
                    await send(res.data);
                    fetchdraws(userInfo.id.toString(), 0, 0).then(r => {
                        setDrawList(r.data);
                        setDrawImg(r.data[0]);
                    })
                    try {
                        const checkoutData: CheckoutParams = {
                            user_email: userInfo.email,
                            user_id: userInfo.id.toString(),
                            transaction_id: transaction_id ? transaction_id : "",
                            points: `${process.env.NEXT_PUBLIC_POINTS_COST_PRE_DRAW}`,
                            action: "2",
                            type: type,
                            note_data:"MJ绘画消耗"
                        }
                        const res: CheckoutRes = await Checkout(checkoutData);
                        if (res.data && res.data.response.data.success) {
                            showToast("扣除积分成功")
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        } catch (error: any) {
            console.log(error);
            showToast("操作失败")
            setDrawing(false)
        }
    }

    const fetchUser = () => {
        if (userToken && userToken !== "") {
            fetchUserInfo().then(r => {
                setUserInfo(r)
            });
        } else {
            return;
        }
    }

    const loadMore = async () => {
        fetchdraws(userInfo.id.toString(), drawList.length, limit).then((res) => {

            if (res.data.length == 0) {
                showToast("没有更多数据了")
                setHasMore(false);
                return;
            } else if (res.data.length == limit) {
                setDrawList((prevDraws) => [...prevDraws, ...res.data]); // 追加新数据到 draws 数组
                setHasMore(true);
                return;
            } else {
                showToast("没有更多数据了");
                setDrawList((prevDraws) => [...prevDraws, ...res.data]);
                setHasMore(false);
                return;
            }
        })
    }

    const shareToGround = async () => {
        if (Object.keys(drawImg).length === 0) {
            showToast("选中你要分享的图片");
            return;
        }
        if (Object.keys(userInfo).length === 0) {
            showToast("请先登录");
            return;
        }
        if (Object.keys(drawImg).length !== 0 && drawImg.shared === true) {
            showToast("请勿重复分享")
            return;
        }
        drawImg.shared = true;
        drawImg.user_id = userInfo.id.toString();
        drawImg.user_name = userInfo.username;
        const res = await send(drawImg)
        if (res.data.acknowledged) {
            showToast("分享成功")
        }
    }

    return (
        <ErrorBoundary>
            {isMobileScreen && (
                <Popup buttonText={drawing ? ("绘图中...") : (submitting ? ("提交中...") : ("提交绘画"))}
                       title="绘图参数" open={showSidebar} onClose={() => setShowSidebar(false)}
                       onClick={active === 0 ? (() => handleAction("imagine")) : (() => handleAction("blend"))}
                       disabled={drawing || submitting}>
                    <>
                        <div className={styles["draw-left-header-mobile"]}>
                            <div className={styles["draw-left-header"]}>
                                <div
                                    className={`${styles["draw-left-header-item"]} ${active === 0 ? styles["active"] : ""}`}
                                    onClick={() => setActive(0)}>
                                    绘图模式
                                </div>
                                <div
                                    className={`${styles["draw-left-header-item"]} ${active === 1 ? styles["active"] : ""}`}
                                    onClick={() => setActive(1)}>
                                    混图模式
                                </div>
                            </div>
                        </div>
                        {active === 0 ? (
                            <div className={styles["draw-left-content"]}>
                                <form className={styles["draw-input-content"]}>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>输入描述</span>
                                            <TextArea style={{ height: 120, resize: 'none' }} className={styles["draw-input"]} name="" id=""
                                                      onChange={(event) => setInputContent(event.target.value)}></TextArea>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>模型风格</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {models.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${selectedModel.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setSelectedModel(item)}>
                                                        <img src={item.img} alt={item.name}/>
                                                        <span>{item.title}</span>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>尺寸</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {sizes.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${selectedSize.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setSelectedSize(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.name}</div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>画质</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {qualities.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${quality.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setQuality(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>版本</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {versions.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${version.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setVersion(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>混乱程度(0-100)</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <input value={inputValue} onChange={handleInput}
                                                       className={styles["draw-input-item-input"]} maxLength={100}
                                                       type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className={styles["draw-left-content"]}>
                                <ImageUploader onUpload={handleUpload}/>
                            </div>
                        )}

                    </>
                </Popup>
            )}
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        AI绘画
                    </div>
                    <div className="window-header-sub-title">
                        @使用AI创建艺术品
                    </div>
                </div>

                <div className="window-actions">
                    {drawImg && drawImg.id && (
                        <div className="window-action-button">
                            <IconButton
                                icon={<ShareIcon/>}
                                // onClick={() => shareToGround()}
                                // onClick={handleCheckout}
                                onClick={async () => {
                                    if (await showConfirm("确认发布到广场？分享后可供公开下载")) {
                                        await shareToGround();
                                    }
                                }}
                                title={"发布"}
                                text={"发布"}
                                bordered
                            />
                        </div>
                    )}

                    {isMobileScreen && (
                        <div className="window-action-button">
                            <IconButton
                                icon={<AddIcon/>}
                                onClick={() => setShowSidebar(true)}
                                // onClick={handleCheckout}
                                title={"添加绘画"}
                                text={"新建"}
                                bordered
                            />
                        </div>
                    )}

                    <div className="window-action-button">
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={() => navigate(Path.Home)}
                            bordered
                        />
                    </div>
                </div>
            </div>

            <div className={styles["draw-container"]}>
                <div className={`${styles["draw-left"]} ${isMobileScreen ? styles["hide-sidebar"] : ""}`}>
                    <div className={styles["draw-left-body"]}>
                        <div className={styles["draw-left-header"]}>
                            <div
                                className={`${styles["draw-left-header-item"]} ${active === 0 ? styles["active"] : ""}`}
                                onClick={() => setActive(0)}>
                                绘图模式
                            </div>
                            <div
                                className={`${styles["draw-left-header-item"]} ${active === 1 ? styles["active"] : ""}`}
                                onClick={() => setActive(1)}>
                                混图模式
                            </div>
                        </div>
                        {active === 0 ? (
                            <div className={styles["draw-left-content"]}>
                                <form className={styles["draw-input-content"]}>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>输入描述</span>
                                            <TextArea style={{ height: 120, resize: 'none' }} className={styles["draw-input"]} name="" id=""
                                                      onChange={(event) => setInputContent(event.target.value)}></TextArea>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>模型风格</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {models.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${selectedModel.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setSelectedModel(item)}>
                                                        <img src={item.img} alt={item.name}/>
                                                        <span>{item.title}</span>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>尺寸</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {sizes.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${selectedSize.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setSelectedSize(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.name}</div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>画质</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {qualities.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${quality.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setQuality(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>版本</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {versions.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${version.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => setVersion(item)}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>混乱程度(0-100)</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <input value={inputValue} onChange={handleInput}
                                                       className={styles["draw-input-item-input"]}
                                                       maxLength={100}
                                                       type="number"/>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className={styles["draw-left-content"]}>
                                <ImageUploader onUpload={handleUpload}/>
                            </div>
                        )}
                    </div>

                    <div className={styles["draw-left-footer"]}>
                        <div className={styles["draw-left-footer-btn"]}>
                            <button
                                onClick={active === 0 ? (() => handleAction("imagine")) : (() => handleAction("blend"))}
                                disabled={drawing || submitting}
                                className={`${submitting || drawing ? styles["draw-submitting"] : ""}`}>
                                {drawing ? ("绘图中...") : (submitting ? ("提交中...") : ("提交绘画"))}
                                <span>消耗{process.env.NEXT_PUBLIC_POINTS_COST_PRE_DRAW}AI币</span>
                            </button>
                        </div>

                    </div>
                </div>
                <div className={`${styles["draw-body"]} ${theme === "light" ? styles["draw-body-light"] : ""}`}>
                    <div className={styles["draw-body-content"]}>
                        <div className={styles["draw-result"]}>
                            <div className={styles["draw-result-item"]}>
                                <div className={styles["draw-img-info"]}>
                                    <div className={styles["draw-img-info-text"]}>
                                        <span
                                            className={styles["draw-img-info-item"]}>{drawImg.prompt ? "提示词：" + drawImg.prompt : ""}</span>
                                        <span
                                            className={styles["draw-img-info-item-date"]}>{drawImg.submitTime ? new Date(parseFloat(String(drawImg.submitTime))).toLocaleString() : ""}</span>
                                    </div>
                                </div>
                                <div className={styles["draw-result-item-img"]}>
                                    <DrawImg
                                        src={drawImg.imageUrl} loading={drawing} progress={drawImg.progress} draw={drawImg}/>
                                </div>

                                <div className={styles["draw-result-item-action"]}>
                                    {U.map((item) => (
                                        <button
                                            disabled={drawing || Object.keys(drawImg).length === 0 || drawImg.action === "UPSCALE"}
                                            key={item.name} className={styles["draw-result-item-action-item"]}
                                            onClick={async () => {
                                                if (await showConfirm("U操作无需消耗积分，确认操作？")) {
                                                    await handleAction("change", item)
                                                }
                                            }}>
                                                <span>
                                                    {item.name}
                                                </span>
                                        </button>
                                    ))}

                                </div>
                                <div className={styles["draw-result-item-action"]}>
                                    {V.map((item) => (
                                        <button
                                            disabled={drawing || Object.keys(drawImg).length === 0 || drawImg.action === "UPSCALE"}
                                            key={item.name} className={styles["draw-result-item-action-item"]}
                                            onClick={async () => {
                                                if (await showConfirm(`V操作将消耗${process.env.NEXT_PUBLIC_POINTS_COST_PRE_DRAW}积分，确认操作？`)) {
                                                    await handleAction("change", item)
                                                }
                                            }}>
                                                <span>
                                                    {item.name}
                                                </span>
                                        </button>
                                    ))}
                                </div>
                                {Object.keys(drawImg).length !== 0 && drawImg.progress !== "100%" && (
                                    <div className={styles["draw-error"]}>
                                        意外中断？
                                        <button onClick={() => fetchProgress(drawImg.id, drawImg.transaction_id)}>
                                            重新获取
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                        {isMobileScreen ? (
                            <div id="bottom-list" className={styles["bottom-list"]}>
                                <div className={styles["bottom-list-content"]}>
                                    {drawList.length > 0 ? (
                                        <div className={styles["bottom-list-btn"]}
                                             onClick={() => setShowSidebar(true)}>
                                            <span>+{drawList.length}</span>
                                        </div>
                                    ) : (
                                        <div className={styles["bottom-list-noitem"]}
                                             onClick={() => setShowSidebar(true)}>
                                            <span>点击右上角新建绘画</span>
                                        </div>
                                    )}
                                    <InfiniteScroll
                                        dataLength={drawList.length}
                                        next={loadMore}
                                        hasMore={hasMore}
                                        loader={<span className={styles["load-more"]}>...</span>}
                                        scrollableTarget="bottom-list"
                                        className={styles["ground__draws-scroll"]}
                                    >
                                        <div className={styles["bottom-list-body"]}>
                                            {drawList.map((item: FetchParams,index  ) => (
                                                    <div key={index}
                                                         className={styles["bottom-list-item"]}
                                                         onClick={() => setDrawImg(item)}>
                                                        <div className={styles["bottom-list-img"]}>
                                                            <Image layout="fill"
                                                                   className={`${styles["bottom-list-img-content"]} ${drawImg.id === item.id ? styles["bottom-list-item-active"] : ""}`}
                                                                   src={item.imageUrl ? item.imageUrl : "./broken-image.svg"}
                                                                   alt=""/>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </InfiniteScroll>
                                </div>

                            </div>
                        ) : (

                            <div id="draw-list" className={styles["draw-list"]}>

                                <span className={styles["draw-list-total"]}>共{drawList.length}个作品</span>
                                <InfiniteScroll
                                    dataLength={drawList.length}
                                    next={loadMore}
                                    hasMore={hasMore}
                                    loader={<span className={styles["load-more"]}>加载中...</span>}
                                    scrollableTarget="draw-list"
                                    className={styles["ground__draws-scroll"]}
                                >
                                    {drawList.map((item: FetchParams,index  ) => (
                                        <div key={index}
                                             className={`${styles["draw-list-item"]} ${drawImg.id === item.id ? styles["draw-list-item-active"] : ""}`}
                                             onClick={() => setDrawImg(item)}>
                                            <div className={styles["draw-list-img"]}>
                                                <Image layout="fill"
                                                       src={item.imageUrl ? item.imageUrl : "./broken-image.svg"}
                                                       className={styles["right-list-img-content"]}
                                                       alt=""/>
                                            </div>
                                        </div>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}