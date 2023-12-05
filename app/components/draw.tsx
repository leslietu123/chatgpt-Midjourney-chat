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
import {showToast, showConfirm} from "@/app/components/ui-lib";
import {DrawImg} from "./drawpic"
import {isLogin} from "@/app/api/backapi/user";
import ImageUploader from "./draw-imageuploader";
import InfiniteScroll from "react-infinite-scroll-component";
import {models, sizes, qualities, versions, iw} from "../static";
import {
    FetchParams,
} from "../api/backapi/types";
import {useAppConfig} from "@/app/store";
import Image from 'next/image';
import {Input} from 'antd';
import RightDrawer from "@/app/components/drawer";
import {promptGen} from "../api/backapi/types";
import {Slider} from 'antd';
import {
    getDrawsByUser,
    getFeatureList, getImgs,
    getPromptsByFeature,
    sendImagine,
    shareToGround,
} from "@/app/api/back/mj";
import {Action, drawRes, Feature, Prompt} from "@/app/api/back/types";
import {Box, ChakraProvider, Flex, Link, Select, Spacer, Tooltip} from "@chakra-ui/react";
import {NotAllowedIcon, WarningIcon} from "@chakra-ui/icons";
import io from "socket.io-client";
import {getTransResult} from "../api/translate/api";
import chakraTheme from "@/app/thems";


const {TextArea} = Input;


export type Style = {
    id: number;
    name: string;
    description: string;
    img: string;
}

const initialState: promptGen = {
    model: models[0],
    content: '',
    style: styles[0],
    size: sizes[0],
    quality: qualities[1],
    version: versions[3],
    chaos: 0,
    styled: 0,
    stop: 100,
    weird: 0,
    tile: '',
    seed: 0,
    prompt: [],
    selectedPrompt: [] as Prompt[],
    iw: iw[0].value,
}

export function Draw() {
    let limit = 20;
    const theme = useAppConfig().theme;
    const navigate = useNavigate();
    const islogin = isLogin();
    const isMobileScreen = useMobileScreen();
    const [active, setActive] = React.useState(0);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [drawImg, setDrawImg] = React.useState({} as FetchParams);
    const [drawing, setDrawing] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [parentImages, setParentImages] = useState<File[]>([]);
    const [hasMore, setHasMore] = useState(true)
    const [prompt, setPrompt] = useState<promptGen>(initialState)
    const [featureList, setFeatureList] = useState<Feature[]>([])
    const [selectedFeature, setSelectedFeature] = useState<Feature>({} as Feature)
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [total, setTotal] = useState(0)
    const [onDrawImg, setOnDrawImg] = useState<drawRes>({} as drawRes)
    const [drawResList, setDrawResList] = useState<drawRes[]>([] as drawRes[])
    const strPrompt = `${prompt.content}${prompt.selectedPrompt.length > 0 ? `,${prompt.selectedPrompt.map(item => item.prompt).join(",")}` : ''}${prompt.model?.value}${prompt.size?.value}${prompt.chaos !== 0 ? ` --chaos ${prompt.chaos}` : ""}${parentImages.length > 0 ? prompt.iw : ""}${prompt.styled !== 0 ? ` --s ${prompt.styled}` : ""}${prompt.stop !== 100 ? ` --stop ${prompt.stop}` : ""}${prompt.weird !== 0 ? ` --weird ${prompt.weird}` : ""}${prompt.tile ? ' --tile' : ""}${prompt.seed !== 0 ? ` --seed ${prompt.seed}` : ""}${prompt.quality?.value}${prompt.version?.value}`
    const [page, setPage] = useState(1)
    console.log(strPrompt)

    const handleFetchPromptList = (id: string) => {
        setSelectedFeature(featureList.find(item => item._id === id) as Feature);
        getPromptsByFeature(id).then((r) => {
            setPrompts(r.data);
            setTotal(r.total);
        })
    }

    const handleSelectPrompt = (id: string) => {
        setPrompt(prevState => {
            const existingPrompt = prevState.selectedPrompt.find(item => item._id === id);
            if (existingPrompt) {
                return prevState;
            }
            return {
                ...prevState,
                selectedPrompt: [...prevState.selectedPrompt, ...prompts.filter(item => item._id === id)]
            };
        });
    }

    const handleDeletePrompt = (id: string) => {
        setPrompt(prevState => {
            return {
                ...prevState,
                selectedPrompt: prevState.selectedPrompt.filter(item => item._id !== id)
            };
        });
    };

    const handleWeightChange = (id: string, weight: string) => {
        setPrompt(prevState => {
            const selectedIndex = prevState.selectedPrompt.findIndex(item => item._id === id);
            if (selectedIndex === -1) {
                return prevState;
            }
            const updatedSelectedPrompt = [...prevState.selectedPrompt];
            updatedSelectedPrompt[selectedIndex] = {
                ...updatedSelectedPrompt[selectedIndex],
                weight: weight
            };
            return {
                ...prevState,
                selectedPrompt: updatedSelectedPrompt
            };
        });
    }


    useEffect(() => {
        getFeatureList(1).then((r) => {
            console.log(r);
            if (r.data.length > 0) {
                setFeatureList(r.data);
                handleFetchPromptList(r.data[0]._id);
            }

        })
    }, []);

    useEffect(() => {
        if (islogin) {
            getDrawsByUser(page).then((r) => {
                setDrawResList(r);
                setPage(page + 1);
            })
        }
    }, []);

    const handleSubmit = async (data: any) => {
        if (!islogin) {
            showToast("请先登录")
            navigate(Path.SignIn)
            return
        }
        if (prompt.content === "" || prompt.content === undefined) {
            showToast("请输入描述")
            return
        }
        setDrawing(true);
        setOnDrawImg({} as drawRes)
        try {
            setSubmitting(true);
            if (parentImages.length > 0) {
                const res = await getImgs(parentImages);
                data.images = res;
            }
            const res = await sendImagine(data);
            if (res.code === 0) {
                showToast("提交成功")
                setSubmitting(false);
                const socket = io(`${process.env.NEXT_PUBLIC_BACK_URL}`);
                socket.on(res.taskId, (data: drawRes) => {
                    setOnDrawImg(data);
                    if (data.progress === 'done') {
                        setDrawing(false);
                        showToast("绘画完成");
                        drawResList.unshift(data);
                        socket.close();
                    }
                });
            } else {
                showToast(res.msg || "提交失败");
                setSubmitting(false);
                setDrawing(false);
            }
        } catch (error) {
            console.log(error);
            setDrawing(false);
            setSubmitting(false);
        }
    }


    const handleUpload = (uploadedImages: File[]) => {
        setParentImages(uploadedImages);
    };


    const loadMore = async () => {
        getDrawsByUser(page).then((res) => {
            if (res.length == 0) {
                showToast("没有更多数据了")
                setHasMore(false);
                return;
            } else if (res.length == limit) {
                setDrawResList((prevDraws) => [...prevDraws, ...res]);
                setPage(page + 1);
                setHasMore(true);
                return;
            } else {
                showToast("没有更多数据了");
                setDrawResList((prevDraws) => [...prevDraws, ...res]);
                setHasMore(false);
                return;
            }
        })
    }

    const copyPromptClipboard = async () => {
        try {
            await navigator.clipboard.writeText(strPrompt || "");
            showToast("已复制到剪切板");
        } catch (err) {
            showToast("复制失败");
            console.error('复制失败: ', err);
        }
    };


    return (
        <ChakraProvider theme={chakraTheme}>
            <ErrorBoundary>
                {isMobileScreen && (
                    <Popup buttonText={drawing ? ("绘图中...") : (submitting ? ("提交中...") : ("提交绘画"))}
                           title="绘图参数" open={showSidebar} onClose={() => setShowSidebar(false)}
                           onClick={active === 0 ? (
                               () => {
                                   handleSubmit({
                                       action: Action.IMAGINE,
                                       prompt: strPrompt,
                                   })
                               }
                           ) : (
                               () => {
                                   handleSubmit({
                                       action: Action.BLEND,
                                   })
                               }
                           )}
                           disabled={drawing || submitting}>
                        <>
                            <div className={styles["draw-left-header-mobile"]}>
                                <div className={styles["draw-left-header"]}>
                                    <div
                                        className={`${styles["draw-left-header-item"]} ${active === 0 ? styles["active"] : ""}`}
                                        onClick={() => {
                                            setActive(0);
                                        }}>
                                        绘图模式
                                    </div>
                                    <div
                                        className={`${styles["draw-left-header-item"]} ${active === 1 ? styles["active"] : ""}`}
                                        onClick={() => {
                                            setActive(1);
                                        }}>
                                        混图模式
                                    </div>
                                </div>
                            </div>
                            {active === 0 ? (
                                <div className={styles["draw-left-content"]}>
                                    <div className={styles["draw-input-item-content"]}>
                                        <span>输入描述</span>
                                        <TextArea style={{height: 120, resize: 'none'}}
                                                  className={styles["draw-input"]} name="" id=""
                                                  onChange={(event) => {
                                                      setPrompt({...prompt, content: event.target.value})
                                                  }}></TextArea>
                                        <button
                                            className={styles["draw-input-item-content-translate"]}
                                            onClick={() => {
                                                getTransResult(prompt.content ? prompt.content : "").then((res) => {
                                                    setPrompt({...prompt, content: res.trans_result[0].dst})
                                                })
                                            }}
                                        >
                                            翻译为英文
                                            <img width={15} src="./baidu.svg" alt=""/>
                                        </button>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>模型风格</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {models.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.model?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, model: item})
                                                         }}>
                                                        <img src={item.img} alt={item.name}/>
                                                        <span>{item.title}</span>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <div className={styles["draw-input-item-prompt-content"]}>
                                                <span>提示词工作台</span>
                                                <RightDrawer
                                                    prompt={prompt}
                                                    prompts={prompts}
                                                    total={total}
                                                    featureList={featureList}
                                                    selectedFeature={selectedFeature}
                                                    selectedPrompt={prompt.selectedPrompt}
                                                    handleSelectPrompt={(_id: string) => {
                                                        handleSelectPrompt(_id)
                                                    }}
                                                    handleDeletePrompt={(_id: string) => {
                                                        handleDeletePrompt(_id)
                                                    }}
                                                    handleFetchPromptList={(_id: string) => {
                                                        handleFetchPromptList(_id)
                                                    }}
                                                    handleWeightChange={(_id: string, weight: string) => {
                                                        handleWeightChange(_id, weight)
                                                    }}
                                                />
                                            </div>
                                            <div className={styles["draw-input-item-prompt-body"]}>
                                                {prompt.content && (
                                                    <div className={styles["draw-input-item-prompt-item-input"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.content}</p>
                                                    </div>
                                                )}
                                                {prompt.selectedPrompt?.map((item, index) => (
                                                    <div
                                                        className={styles["draw-input-item-prompt-item"]}
                                                        key={index}
                                                    >
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{item.prompt}{item.weight ? `::${item.weight}` : ""}</p>
                                                        <NotAllowedIcon color={'red'} boxSize={3} onClick={() => {
                                                            handleDeletePrompt(item._id)
                                                        }}/>
                                                    </div>
                                                ))}
                                                {prompt.size?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.size.value}</p>
                                                    </div>
                                                )}
                                                {prompt.model?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.model.value}</p>
                                                    </div>
                                                )}
                                                {prompt.chaos !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--chaos ${prompt.chaos}`}</p>
                                                    </div>
                                                )}
                                                {prompt.styled !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--s ${prompt.styled}`}</p>
                                                    </div>
                                                )}
                                                {prompt.seed !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--seed ${prompt.seed}`}</p>
                                                    </div>
                                                )}
                                                {prompt.weird !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--weird ${prompt.weird}`}</p>
                                                    </div>
                                                )}
                                                {prompt.stop !== 0 && prompt.stop !== 100 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--stop ${prompt.stop}`}</p>
                                                    </div>
                                                )}
                                                {prompt.quality?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.quality.value}</p>
                                                    </div>
                                                )}
                                                {prompt.version?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.version.value}</p>
                                                    </div>
                                                )}

                                            </div>
                                            <Flex>
                                                <Link fontSize={12} color='teal.500' onClick={copyPromptClipboard}>
                                                    复制提示词
                                                </Link>
                                                <Spacer/>
                                                <Link fontSize={12} color='red.500'
                                                      onClick={() => setPrompt(initialState)}>
                                                    重置
                                                </Link>
                                            </Flex>
                                        </div>
                                    </div>

                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>模型风格</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {models.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.model?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, model: item})
                                                         }}>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.size?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, size: item})
                                                         }}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>
                                                            <div style={{
                                                                width: "20px",
                                                                border: 'var(--draw-img-border)',
                                                                paddingTop: item.style,
                                                                margin: "auto",
                                                                borderRadius: "3px"
                                                            }}></div>
                                                            {item.name}
                                                        </div>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.quality?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, quality: item})
                                                         }}>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.version?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, version: item})
                                                         }}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span className={styles['slider-title-content']}>混乱程度</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={100}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, chaos: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span className={styles['slider-title-content']}>风格化</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={1000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, styled: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span className={styles['slider-title-content']}>seed种子</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={10000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, seed: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span className={styles['slider-title-content']}>weird奇妙</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={3000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, weird: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span className={styles['slider-title-content']}>stop停止</span>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={100}
                                                    max={100}
                                                    tooltip={{open: true, placement: "left", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, stop: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
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
                        {onDrawImg && onDrawImg._id && (
                            <div className="window-action-button">
                                <IconButton
                                    icon={<ShareIcon/>}
                                    onClick={async () => {
                                        if (await showConfirm("确认发布到广场？分享后可供公开下载")) {
                                            shareToGround(onDrawImg._id).then((res) => {
                                                if (res) {
                                                    showToast("发布成功")
                                                } else {
                                                    showToast("发布失败")
                                                }
                                            });
                                        }
                                    }}
                                    title={"发布"}
                                    text={onDrawImg.isPublic ? "已发布" : "发布"}
                                    disabled={onDrawImg.isPublic}
                                    bordered
                                />
                            </div>
                        )}

                        {isMobileScreen && (
                            <div className="window-action-button">
                                <IconButton
                                    icon={<AddIcon/>}
                                    onClick={() => setShowSidebar(true)}
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
                                    onClick={() => {
                                        setActive(0)
                                    }}>
                                    绘图模式
                                </div>
                                <div
                                    className={`${styles["draw-left-header-item"]} ${active === 1 ? styles["active"] : ""}`}
                                    onClick={() => {
                                        setActive(1)
                                    }}>
                                    混图模式
                                </div>
                            </div>
                            {active === 0 ? (
                                <div className={styles["draw-left-content"]}>
                                    {/*<form className={styles["draw-input-content"]}>*/}
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <span>输入描述</span>
                                            <TextArea style={{height: 120, resize: 'none'}}
                                                      className={styles["draw-input"]} name="" id=""
                                                      onChange={(event) => {
                                                          setPrompt({...prompt, content: event.target.value})
                                                      }}></TextArea>
                                            <button
                                                className={styles["draw-input-item-content-translate"]}
                                                onClick={() => {
                                                    getTransResult(prompt.content ? prompt.content : "").then((res) => {
                                                        setPrompt({...prompt, content: res.trans_result[0].dst})
                                                    })
                                                }}
                                            >
                                                翻译为英文
                                                <img width={15} src="./baidu.svg" alt=""/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <div className={styles["draw-input-item-prompt-content"]}>
                                                <span>提示词工作台</span>
                                                <RightDrawer
                                                    prompt={prompt}
                                                    prompts={prompts}
                                                    total={total}
                                                    featureList={featureList}
                                                    selectedFeature={selectedFeature}
                                                    selectedPrompt={prompt.selectedPrompt}
                                                    handleSelectPrompt={(_id: string) => {
                                                        handleSelectPrompt(_id)
                                                    }}
                                                    handleDeletePrompt={(_id: string) => {
                                                        handleDeletePrompt(_id)
                                                    }}
                                                    handleFetchPromptList={(_id: string) => {
                                                        handleFetchPromptList(_id)
                                                    }}
                                                    handleWeightChange={(_id: string, weight: string) => {
                                                        handleWeightChange(_id, weight)
                                                    }}
                                                />
                                            </div>
                                            <div className={styles["draw-input-item-prompt-body"]}>
                                                {prompt.content && (
                                                    <div className={styles["draw-input-item-prompt-item-input"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.content}</p>
                                                    </div>
                                                )}
                                                {prompt.selectedPrompt?.map((item, index) => (
                                                    <div
                                                        className={styles["draw-input-item-prompt-item"]}
                                                        key={index}
                                                    >
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{item.prompt}{item.weight ? `::${item.weight}` : ""}</p>
                                                        <NotAllowedIcon color={'red'} boxSize={3} onClick={() => {
                                                            handleDeletePrompt(item._id)
                                                        }}/>
                                                    </div>
                                                ))}
                                                {prompt.size?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.size.value}</p>
                                                    </div>
                                                )}
                                                {prompt.model?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.model.value}</p>
                                                    </div>
                                                )}
                                                {prompt.chaos !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--chaos ${prompt.chaos}`}</p>
                                                    </div>
                                                )}
                                                {prompt.styled !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--s ${prompt.styled}`}</p>
                                                    </div>
                                                )}
                                                {prompt.seed !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--seed ${prompt.seed}`}</p>
                                                    </div>
                                                )}
                                                {prompt.weird !== 0 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--weird ${prompt.weird}`}</p>
                                                    </div>
                                                )}
                                                {prompt.stop !== 0 && prompt.stop !== 100 && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{`--stop ${prompt.stop}`}</p>
                                                    </div>
                                                )}
                                                {prompt.quality?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.quality.value}</p>
                                                    </div>
                                                )}
                                                {prompt.version?.value && (
                                                    <div className={styles["draw-input-item-prompt-item"]}>
                                                        <p className={styles["draw-input-item-prompt-item-text"]}>{prompt.version.value}</p>
                                                    </div>
                                                )}

                                            </div>
                                            <Flex>
                                                <Link fontSize={12} color='teal.500' onClick={copyPromptClipboard}>
                                                    复制提示词
                                                </Link>
                                                <Spacer/>
                                                <Link fontSize={12} color='red.500'
                                                      onClick={() => setPrompt(initialState)}>
                                                    重置
                                                </Link>
                                            </Flex>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>

                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span>垫图</span>
                                                </Box>
                                                <Spacer/>
                                                <Box>
                                                    <Select fontSize={12} border={0} size={'sm'}
                                                            defaultValue={iw[0].value}
                                                            onChange={(event) => {
                                                                let selectedValue = event.target.value;
                                                                let selectedItem = iw.find(item => item.value === selectedValue);
                                                                setPrompt(prompt => ({...prompt, iw: selectedItem?.value}));
                                                            }}>
                                                        {iw.map((item, index) => (
                                                            <option key={index} value={item.value}>{item.name}</option>
                                                        ))}
                                                    </Select>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <ImageUploader onUpload={handleUpload}/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span>模型风格</span>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                {models.map((item, index) => (
                                                    <div key={item.id}
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.model?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, model: item})
                                                         }}>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.size?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, size: item})
                                                         }}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>
                                                            <div style={{
                                                                width: "20px",
                                                                border: 'var(--draw-img-border)',
                                                                paddingTop: item.style,
                                                                margin: "auto",
                                                                borderRadius: "3px"
                                                            }}></div>
                                                            {item.name}
                                                        </div>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.quality?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, quality: item})
                                                         }}>
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
                                                         className={`${styles["draw-input-item-content-item"]} ${prompt.version?.id === item.id ? styles["actived"] : ""}`}
                                                         onClick={() => {
                                                             setPrompt({...prompt, version: item})
                                                         }}>
                                                        <div
                                                            className={styles["draw-input-item-content-text"]}>{item.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span className={styles['slider-title-content']}>混乱程度</span>
                                                </Box>
                                                <Spacer/>
                                                <Box>
                                                    <Tooltip size={"sm"} hasArrow
                                                             label='参数释义：这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱'
                                                             bg='gray.300' color='black'>
                                                        <WarningIcon/>
                                                    </Tooltip>
                                                </Box>
                                            </Flex>

                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={100}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, chaos: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span className={styles['slider-title-content']}>风格化</span>
                                                </Box>
                                                <Spacer/>
                                                <Box>
                                                    <Tooltip size={"sm"} hasArrow
                                                             label='参数释义：数值越高，画面表现也会更具丰富性和艺术性'
                                                             bg='gray.300' color='black'>
                                                        <WarningIcon/>
                                                    </Tooltip>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={1000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, styled: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span className={styles['slider-title-content']}>seed种子</span>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={10000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, seed: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span className={styles['slider-title-content']}>weird奇妙</span>
                                                </Box>
                                                <Spacer/>
                                                <Box>
                                                    <Tooltip size={"sm"} hasArrow
                                                             label='参数释义：生成的图像引入奇特和离奇的特质，从而产生独特而意想不到的结果'
                                                             bg='gray.300' color='black'>
                                                        <WarningIcon/>
                                                    </Tooltip>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={0}
                                                    max={3000}
                                                    tooltip={{open: true, placement: "right", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, weird: value})
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <Flex alignItems={"center"}>
                                                <Box>
                                                    <span className={styles['slider-title-content']}>stop停止</span>
                                                </Box>
                                                <Spacer/>
                                                <Box>
                                                    <Tooltip size={"sm"} hasArrow
                                                             label='参数释义：使用"--stop"参数可以在作业进行到对应的任务百分比时终止任务，比如30，在任务的30%进度时停止'
                                                             bg='gray.300' color='black'>
                                                        <WarningIcon/>
                                                    </Tooltip>
                                                </Box>
                                            </Flex>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <Slider
                                                    style={{width: '100%'}}
                                                    defaultValue={100}
                                                    max={100}
                                                    tooltip={{open: true, placement: "left", color: 'rgb(77, 77, 77)'}}
                                                    onChange={(value) => {
                                                        setPrompt({...prompt, stop: value})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/*</form>*/}
                                </div>
                            ) : (
                                <div className={styles["draw-left-content"]}>
                                    <div className={styles["draw-input-item"]}>
                                        <div className={styles["draw-input-item-content"]}>
                                            <div className={styles["draw-input-item-content-body"]}>
                                                <ImageUploader onUpload={handleUpload}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles["draw-left-footer"]}>
                            <div className={styles["draw-left-footer-btn"]}>
                                <button
                                    // onClick={active === 0 ? (() => handleAction("imagine")) : (() => handleAction("blend"))}
                                    onClick={active === 0 ? (
                                        () => {
                                            handleSubmit({
                                                action: Action.IMAGINE,
                                                prompt: strPrompt,
                                            })
                                        }
                                    ) : (
                                        // handleGetImgsUrl
                                        () => {
                                            handleSubmit({
                                                action: Action.BLEND,
                                            })
                                        }
                                    )}
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
                                            <span className={styles["draw-img-info-item-date"]}>
                                                {drawImg.submitTime ? new Date(parseFloat(String(drawImg.submitTime))).toLocaleString() : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles["draw-result-item-img"]}>
                                        <DrawImg
                                            loading={drawing}
                                            progress={onDrawImg.progress ? onDrawImg.progress : ''}
                                            onDrawImg={onDrawImg}/>
                                    </div>

                                    <div className={styles["draw-result-item-action"]}>
                                        {onDrawImg.options && onDrawImg.options
                                            .filter(item => item.label !== "❤️")
                                            .map(item => (
                                                    <button
                                                        key={item.label} className={styles["draw-result-item-action-item"]}
                                                        onClick={() => {
                                                            // if (await showConfirm(`操作将消耗${process.env.NEXT_PUBLIC_POINTS_COST_PRE_DRAW}积分，确认操作？`)) {
                                                            //     // await handleAction("change", item)
                                                            //
                                                            // }
                                                            handleSubmit({
                                                                action: Action.CUSTOM,
                                                                msgId: onDrawImg.draw_id,
                                                                flags: onDrawImg.flags,
                                                                cmd: item.custom,
                                                                prompt: onDrawImg.prompt,
                                                                config_id: onDrawImg.config_id,
                                                            })
                                                        }}>
                                                <span>
                                                    {item.label}
                                                </span>
                                                    </button>
                                                )
                                            )}
                                    </div>
                                </div>
                            </div>
                            {isMobileScreen ? (
                                <div id="bottom-list" className={styles["bottom-list"]}>
                                    <div className={styles["bottom-list-content"]}>
                                        {drawResList.length > 0 ? (
                                            <div className={styles["bottom-list-btn"]}
                                                 onClick={() => setShowSidebar(true)}>
                                                <span>+{drawResList.length}</span>
                                            </div>
                                        ) : (
                                            <div className={styles["bottom-list-noitem"]}
                                                 onClick={() => setShowSidebar(true)}>
                                                <span>点击右上角新建绘画</span>
                                            </div>
                                        )}
                                        <InfiniteScroll
                                            dataLength={drawResList.length}
                                            next={loadMore}
                                            hasMore={hasMore}
                                            loader={<span className={styles["load-more"]}>...</span>}
                                            scrollableTarget="bottom-list"
                                            className={styles["ground__draws-scroll"]}
                                        >
                                            <div className={styles["bottom-list-body"]}>
                                                {drawResList.map((item: drawRes, index) => (
                                                    <div key={index}
                                                         className={styles["bottom-list-item"]}
                                                         onClick={() => setOnDrawImg(item)}
                                                    >
                                                        <div className={styles["bottom-list-img"]}>
                                                            <Image layout="fill"
                                                                   className={`${styles["bottom-list-img-content"]} ${onDrawImg._id === item._id ? styles["bottom-list-item-active"] : ""}`}
                                                                   src={item.uri ? item.uri : "./broken-image.svg"}
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
                                    <span className={styles["draw-list-total"]}>共{drawResList.length}个作品</span>
                                    <InfiniteScroll
                                        dataLength={drawResList.length}
                                        next={loadMore}
                                        hasMore={hasMore}
                                        loader={<span className={styles["load-more"]}>加载中...</span>}
                                        scrollableTarget="draw-list"
                                        className={styles["ground__draws-scroll"]}
                                    >
                                        {drawResList.map((item: drawRes, index) => (
                                            <div key={index}
                                                 className={`${styles["draw-list-item"]} ${onDrawImg._id === item._id ? styles["draw-list-item-active"] : ""}`}
                                                 onClick={() => setOnDrawImg(item)}
                                            >
                                                <div className={styles["draw-list-img"]}>
                                                    <Image layout="fill"
                                                           src={item.uri ? item.uri : "./broken-image.svg"}
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
        </ChakraProvider>
    )
}