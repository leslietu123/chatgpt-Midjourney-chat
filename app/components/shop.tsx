import React, {useEffect, useState} from "react";
import {getPointsplan, creatOrder, getPaymentQrcode, checkOrder} from "../api/backapi/shop";
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import styles from './shop.module.scss';
import {Path} from "@/app/constant";
import mixpanel from "mixpanel-browser";
import {useNavigate} from "react-router-dom";
import {ErrorBoundary} from "@/app/components/error";
import Loading from "./loader";
import {useMobileScreen} from "@/app/utils";
import {isWebApp, getUserInfo, isLogin} from "../api/backapi/user";
import {showToast} from "@/app/components/ui-lib";
import PopUp from "./pop";
import {payment, point,} from "../api/backapi/types";
import {useAppConfig} from "@/app/store";
import {useage} from "../api/backapi/static";
import {CreateOrder, Member, paymentMethod, PaymentMethod} from "@/app/api/back/types";
import {checkOrderStatus, createNewOrder, getMembers, getPayments, Pay} from "@/app/api/back/shop";

mixpanel.init(`${process.env.NEXT_PUBLIC_MIXPANEL_CLIENT_ID}`, {debug: true});


export function Shop() {
    const navigate = useNavigate();
    const theme = useAppConfig().theme;
    const isMobileScreen = useMobileScreen();
    const isMobileBroswer =
        /Mobile|(Android|iPhone).+Mobile/.test(window.navigator.userAgent) &&
        !/MicroMessenger/.test(window.navigator.userAgent);
    const loginStatus = isLogin();
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [open, setOpen] = useState(false);
    const [onPay, setOnPay] = useState(false);
    const [orderID, setOrderID] = useState("");
    const [members, setMembers] = useState<Member[]>([] as Member[])
    const [selectedMember, setSelectedMember] = useState(members[0] || {} as Member);
    const [pryment, setPayment] = useState<PaymentMethod[]>([] as PaymentMethod[]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(pryment[0] || {} as PaymentMethod);


    useEffect(() => {
        if (isMobileBroswer && isMobileScreen) {
            setSelectedPaymentMethod(pryment[1])
        }
        const fetchPoints = async () => {
            setLoading(true);
            try {
                const res: Member[] = await getMembers();
                setLoading(false);
                if (res) {
                    setMembers(res);
                    setSelectedMember(res[0])
                } else {
                    // handle the situation when res is undefined
                    console.log("Failed to get Members");
                }
            } catch (error) {
                console.error(error);
            }
        }

        const fetchPaymenys = async () => {
            setLoading(true);
            try {
                const res: PaymentMethod[] = await getPayments();
                setLoading(false);
                if (res) {
                    setPayment(res);
                    setSelectedPaymentMethod(res[0])
                } else {
                    // handle the situation when res is undefined
                    console.log("Failed to get points");
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPaymenys();
        fetchPoints();
    }, []);

    const handleCreateOrder = async () => {
        if (!loginStatus) {
            showToast("您还没有登录");
            navigate(Path.SignUp);
            return;
        }

        const now_date = new Date();

        const data: CreateOrder = {
            name: selectedMember.name,
            total: selectedMember.price,
            memberId: selectedMember._id,
            paymentId: selectedPaymentMethod._id,
        }

        try {
            setOnPay(true);
            const res = await createNewOrder(data);
            if (res && res._id) {
                setOrderID(res._id);
                const payRes = await Pay(res._id);
                mixpanel.track("创建订单", {
                    "订单ID": res._id,
                    "套餐名": selectedMember.name,
                    "金额": selectedMember.price,
                    "支付方式": selectedPaymentMethod.method,
                })
                if (payRes && payRes.errcode === 0) {
                    payRes.order_id = res._id;
                    payRes.order_date = new Date();
                    payRes.payment = selectedPaymentMethod;
                    if (!isWebApp()) {
                        setQrCode(payRes.url_qrcode);
                        setOpen(true);
                    }
                    if (isWebApp()) {
                        window.location.href = payRes.url;
                    }
                }
            } else {
                console.log("Failed to get user info");
            }
            setOnPay(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckOrder = async (order_id: string) => {
        try {
            const res = await checkOrderStatus(order_id);
            if (res) {
                showToast("支付成功");
                navigate(Path.Home);
            } else {
                showToast("支付失败");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <ErrorBoundary>
            <PopUp open={open}
                   title={selectedPaymentMethod.method === paymentMethod.wechat ? "使用微信扫码支付" : "使用支付宝扫码支付"}
                   buttonText="已支付" hideClose={false}
                   onClick={() => handleCheckOrder(orderID)} onClose={() => setOpen(false)}>
                <div className={styles["pay-qrcode"]}>
                    <img src={qrCode} alt=""/>
                    <span>请在5分钟内完成支付</span>
                </div>
            </PopUp>
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        购买积分
                    </div>
                    <div className="window-header-sub-title">
                        @所有积分通用于所有服务
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

            <div className={`${styles["shop-container"]} ${theme === "dark" ? styles["shop-container-dark"] : ""}`}>
                <div className={styles["shop-header"]}>
                    <span className={styles["shop-header-title"]}>
                        选择积分套餐
                    </span>
                </div>
                <div className={styles["shop-body"]}>
                    {loading ? (<Loading/>) : (
                        <div className={styles["shop-card"]}>

                            {members.sort((a, b) => a.price - b.price).map((item: Member, index: number) => (
                                <div key={index}
                                     className={`${styles["shop-card-item"]} ${selectedMember._id == item._id ? styles["shop-card-item-selected"] : ""}`}
                                     onClick={() => setSelectedMember(item)}>

                                    <div className={styles["shop-card-item-title"]}>
                                        {item.name}
                                    </div>
                                    <div className={styles["shop-card-price"]}>
                                        <div className={styles["shop-card-price-title"]}>
                                            价格
                                        </div>
                                        <div className={styles["shop-card-item-price"]}>
                                            ¥{item.price}
                                        </div>
                                    </div>
                                    {useage.map((item: any, index: number) => (
                                        <div key={item.id} className={styles["shop-card-price"]}>
                                            <div className={styles["shop-card-price-title"]}>
                                                {item.name}
                                            </div>
                                            <div className={styles["shop-card-item-info"]}>
                                                {item.useage + "ai币/次"}
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            ))}
                        </div>
                    )}

                </div>
                <div className={styles["shop-header"]}>
                    <span className={styles["shop-header-title"]}>
                        选择支付方式
                    </span>
                </div>
                <div className={`${styles["shop-body"]} ${styles["shop-body-mobile"]}`}>
                    {loading ? (<Loading/>) : (
                        <div className={styles["shop-card"]}>
                            {pryment.map((item: PaymentMethod, index: number) => (
                                <div key={index}
                                     className={`${styles["shop-card-item"]} ${selectedPaymentMethod._id == item._id ? styles["shop-card-item-selected"] : ""}`}
                                     onClick={() => setSelectedPaymentMethod(item)}>
                                    <div
                                        className={`${styles["shop-card-item-title"]} ${styles["shop-card-item-title-payment"]}`}>
                                        {item.method === paymentMethod.wechat ? "微信支付" : "支付宝支付"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles["shop-footer"]}>
                    <div className={styles["shop-footer-content"]}>
                        <div className={styles["shop-footer-item"]}>
                            <button onClick={handleCreateOrder}
                                    className={`${styles["shop-footer-btn"]} ${onPay ? styles["shop-footer-btn-onpay"] : ""}`}
                                    disabled={onPay}>
                        <span className={styles["shop-footer-title"]}>
                            {selectedMember.price && selectedMember.price ? "¥" + selectedMember.price : ""}
                        </span>
                                {onPay ? ("支付中...") : ("去支付")}
                            </button>
                        </div>

                    </div>

                </div>


            </div>
        </ErrorBoundary>
    )
}