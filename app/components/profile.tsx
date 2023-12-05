import {IconButton} from "@/app/components/button";
import AddIcon from "@/app/icons/add.svg";
import CloseIcon from "@/app/icons/close.svg";
import LightningIcon from "../icons/lightning.svg";
import {Path} from "@/app/constant";
import {useNavigate} from "react-router-dom";
import {ErrorBoundary} from "@/app/components/error";
import styles from './profile.module.scss';
import React, {useEffect, useState} from "react";
import {fetchUserInfo, getPointsTransaction} from "../api/backapi/user";
import {List, Skeleton} from 'antd';
import {ChatAction} from "./chat";
import CopyIcon from "../icons/copy.svg";
import InfoIcon from "../icons/eye.svg";
import {showConfirm, showToast} from "./ui-lib";
import ShareInfo from "./shareinfo";
import PopUp from "./pop";
import {PointsListProps, tarns,} from "../api/backapi/types";
import InfiniteScroll from "react-infinite-scroll-component";
import {getMe, getMyLogs} from "@/app/api/back/user";
import {Log, User} from "../api/back/types";


async function fetchTransaction(email: string, index: number) {
    return await getPointsTransaction(email, index);
}

export const initUser={
    _id: "",
    name: "",
    phone: "",
    member: {
        _id: "",
        name: "",
        length: 0,
        unlimited: false,
        point: {
            _id: "",
            name: "",
            points: 0,
            unlimited: false,
            consumption: {
                mj: 0,
                gpt3_5: 0,
                gpt4_0: 0
            }
        },
    },
    memberInfo: {
        start_at: "",
        end_at: "",
        points: 0,
        status: ""
    },
    created_at: "",
    updated_at: ""
} as unknown as User

function PointsList(props: PointsListProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Log[]>([] as Log[]);
    const [list, setList] = useState<Log[]>([] as Log[]);
    const [pageIndex, setPageIndex] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [amount, setAmount] = useState(0);
    const [currentAmount, setCurrentAmount] = useState(0)
    useEffect(() => {
        try {
            getMyLogs(pageIndex).then(res => {
                setData(res.data)
                setList(res.data)
                setPageIndex(pageIndex + 1)
            })
        }catch (e) {
            console.log(e)
        }
    }, []);

    const onLoadMore = () => {
        setLoading(true);
        // Increment the page index
        getMyLogs(pageIndex).then(res => { // Fetch the transactions for the new page
            if (res && res.data.length !== 0) {
                const newData = data.concat(res.data);
                setData(newData);
                setList(newData);
                setAmount(res.total)
                setLoading(false);
                setPageIndex(pageIndex + 1);
            } else {
                setLoading(false);
                showToast("没有更多数据了");
                setLoading(false);
                setHasMore(false)
                return;
            }
        });
    };

    return (
        <div id="list">
            <InfiniteScroll
                dataLength={list.length}
                next={onLoadMore}
                hasMore={hasMore}
                loader={amount > 0 && (<span
                    className={styles["load-more"]}>{"共计" + amount + "条数据，当前已加载" + currentAmount + "条"}</span>)}
                scrollableTarget="popup-body"
                className={styles["ground__draws-scroll"]}
            >
                <List
                    id="profile-points-list"
                    className={styles["profile-points-list"]}
                    loading={loading}
                    // itemLayout="horizontal"
                    dataSource={list}
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={loading} active>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large} />}
                                    // title={new Date(parseFloat(item.created_at) * 1000).toLocaleString()}
                                    description={item.content}
                                    title={new Date(item.created_at).toLocaleString()}
                                    style={{color: "#fff !important"}}
                                />
                                <div
                                    className="list-item-points">{item.content}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />

            </InfiniteScroll>
            {!hasMore && (<span className={styles["load-more"]}>到底了...</span>)}
        </div>

    );
};


export function UserProfile() {
    const navigate = useNavigate();
    const userToken = localStorage.getItem("user_token");
    const [userInfo, setUserInfo] = React.useState<User>(initUser);

    const [loading, setLoading] = React.useState(false);
    const [showShareInfo, setShowShareInfo] = React.useState(false);
    const [showPointsTransaction, setShowPointsTransaction] = React.useState(false);


    useEffect(() => {
            if (userToken && userToken !== "") {
                getMe().then(r => {
                    setUserInfo(r);
                    setLoading(false);
                });
            } else {
                navigate(Path.SignIn);
                return;
            }
        }
        , [])


    const handleSignOut = () => {
        localStorage.removeItem("user_token");
        navigate(Path.SignIn);
    }

    const copyCodeClipboard = async () => {
        try {
            await navigator.clipboard.writeText(userInfo.ref_code);
            showToast("已复制到剪切板");
        } catch (err) {
            showToast("复制失败");
            console.error('复制失败: ', err);
        }
    };
    const copyLinkClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONT_URL}/#/sign-up?ref=` + userInfo.ref_code);
            showToast("已复制到剪切板");
        } catch (err) {
            showToast("复制失败");
            console.error('复制失败: ', err);
        }
    }

    return (
        <ErrorBoundary>
            <PopUp title="分享说明" open={showShareInfo} onClick={() => setShowShareInfo(false)}
                   buttonText="我知道了" content={<ShareInfo/>} onClose={() => setShowShareInfo(false)}/>
            <PopUp hideButton={true} title="积分明细" open={showPointsTransaction}
                   onClick={() => setShowPointsTransaction(false)}
                   buttonText="我知道了" content={<PointsList />}
                   onClose={() => setShowPointsTransaction(false)}
            />
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        个人中心
                    </div>
                    <div className="window-header-sub-title">
                        @用户个人中心
                    </div>
                </div>
                <div className="window-actions">
                    <div className="window-action-button"></div>
                    <div className="window-action-button"></div>
                    <div className="window-action-button">
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={() => navigate(Path.Home)}
                            bordered
                        />
                    </div>
                </div>
            </div>

            <div className={styles["profile-container"]}>
                <div className={styles["profile-header"]}>
                </div>
                <div className={styles["profile-content"]}>
                    <div className={styles["profile-header-avatar"]}>
                        <img className={styles["profile-avater"]}
                             src="./profile-avater.jpg" alt=""/>
                        <div>
                            <span
                                className={styles["profile-header-name"]}>{userInfo.name ? "@" + userInfo.name : "..."}</span>
                            <span
                                className={styles["profile-memberinfo"]}>{userInfo._id ? "#" + userInfo._id : "..."}</span>
                        </div>
                        <div className={styles["profile-info"]}>
                            <div className={styles["profile-points"]}>
                                <div className={styles["profile-points-header"]}>
                                    <h4>我的ai币</h4>
                                    <div className={styles["profile-points-action"]}>
                                        <IconButton onClick={() => setShowPointsTransaction(true)}
                                                    className={styles["profile-points-add"]} text="积分明细"
                                                    icon={<LightningIcon/>}
                                                    shadow/>
                                        <IconButton onClick={() => navigate(Path.BuyPoints)}
                                                    className={styles["profile-points-add"]} text="充值"
                                                    icon={<AddIcon/>}
                                                    shadow/>
                                    </div>

                                </div>
                                <div className={styles["profile-points-item"]}>
                                    <span>{userInfo.memberInfo.points ? "剩余AI币" : "..."}</span>
                                    <p>{userInfo.memberInfo.points ? userInfo.memberInfo.points : "..."}</p>
                                </div>
                            </div>
                            <div className={styles["profile-points"]}>
                                <div className={styles["profile-points-header"]}>
                                    <h4>分享得AI币</h4>
                                    <IconButton onClick={() => setShowShareInfo(true)}
                                                className={styles["profile-points-add"]} text="说明"
                                                icon={<InfoIcon/>}
                                                shadow/>
                                </div>
                                <div className={styles["profile-points-item"]}>
                                    <span>{userInfo.ref_code ? "我的邀请码" : "..."}</span>
                                    <div className={styles["profile-points-item-copy"]}>
                                        {!loading &&
                                            <ChatAction text="" icon={<CopyIcon/>} style={{marginTop: "3px"}}
                                                        onClick={copyCodeClipboard}/>}
                                        <p>{userInfo.ref_code ? userInfo.ref_code : "..."}</p>
                                    </div>
                                </div>
                                <div className={styles["profile-points-item"]}>
                                    <span>{userInfo.ref_code ? "我的邀请链接" : "..."}</span>
                                    <div className={styles["profile-points-item-copy"]}>
                                        {!loading &&
                                            <ChatAction text="" icon={<CopyIcon/>} style={{marginTop: "3px"}}
                                                        onClick={copyLinkClipboard}/>}
                                        <p>{userInfo.ref_code ? `${process.env.NEXT_PUBLIC_FRONT_URL}/#/sign-up?wlr_ref=` + userInfo.ref_code : "..."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className={styles["profile-signout"]} onClick={async () => {
                            if (await showConfirm("退出登录？")) {
                                handleSignOut();
                            }
                        }}>
                            退出登录
                        </span>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
