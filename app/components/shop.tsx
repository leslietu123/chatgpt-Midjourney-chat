import React, {useEffect, useState} from "react";
import {getPointsplan, creatOrder, getPaymentQrcode, checkOrder} from "../api/backapi/shop";
import {IconButton} from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import styles from './shop.module.scss';
import {Path} from "@/app/constant";
import {useNavigate} from "react-router-dom";
import {ErrorBoundary} from "@/app/components/error";
import Loading from "./loader";
import {useMobileScreen} from "@/app/utils";
import {isWebApp, getUserInfo, isLogin} from "../api/backapi/user";
import {showToast} from "@/app/components/ui-lib";
import PopUp from "./pop";
import { payment, point, } from "../api/backapi/types";
import {useAppConfig} from "@/app/store";
import {useage} from "../api/backapi/static";

const Payment: payment[] = [
    {
        id: 1,
        img: "https://www.aitrans.online/wp-content/uploads/2021/08/wechat.png",
        payment_method: "wechat",
        payment_method_title: "微信支付",
        description: "使用微信扫码支付",
    },
    {
        id: 2,
        img: "https://www.aitrans.online/wp-content/uploads/2021/08/alipay.png",
        payment_method: "alipay",
        payment_method_title: "支付宝支付",
        description: "使用支付宝扫码支付",
    }
]

export function Shop() {
    const navigate = useNavigate();
    const theme = useAppConfig().theme;
    const isMobileScreen = useMobileScreen();
    const isMobileBroswer =
        /Mobile|(Android|iPhone).+Mobile/.test(window.navigator.userAgent) &&
        !/MicroMessenger/.test(window.navigator.userAgent);
    const loginStatus = isLogin();
    const [points, setPoints] = useState([] as point[]);
    const [selectedPoint, setSelectedPoint] = useState(points[1] || {} as point);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({} as any);
    const [selectedPayment, setSelectedPayment] = useState(Payment[0] || {} as payment);
    const [qrCode, setQrCode] = useState("");
    const [open, setOpen] = useState(false);
    const [onPay, setOnPay] = useState(false);
    const [orderID, setOrderID] = useState(0);

    useEffect(() => {
        if (isMobileBroswer && isMobileScreen) {
            setSelectedPayment(Payment[1])
        }
        const fetchPoints = async () => {
            setLoading(true);
            try {
                const res: point[] = await getPointsplan();
                setLoading(false);
                if (res) {
                    setPoints(res);
                    setSelectedPoint(res[1])
                } else {
                    // handle the situation when res is undefined
                    console.log("Failed to get points");
                }
            } catch (error) {
                console.error(error);
            }
        }
        const fetchUserInfo = async () => {
            try {
                const res = await getUserInfo();
                if (res && res.data.id.toString() !== "" && res.data.id !== undefined) {
                    setUser(res.data);
                } else {
                    // handle the situation when res is undefined
                    console.log("Failed to get user info");
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPoints();
        fetchUserInfo();
    }, []);

    const handleCreateOrder = async () => {
        if (!loginStatus) {
            showToast("您还没有登录");
            navigate(Path.SignUp);
            return;
        }

        const now_date = new Date();
        const lastOrderKey = `order${selectedPoint.post_id}${selectedPayment.payment_method}`;
        const last_order = localStorage.getItem(lastOrderKey);
        const order = last_order ? JSON.parse(last_order) : null;

        if (order && (now_date.getTime() - new Date(order.order_date).getTime()) < 300000) {
            setSelectedPayment(order.payment);
            setOrderID(order.order_id);
            if (!isWebApp()) {
                setQrCode(order.url_qrcode);
                setOpen(true);
            }
            if (isWebApp()) {
                window.location.href = order.url;
            }
        } else {
            try {
                setOnPay(true);
                const res = await creatOrder(selectedPoint, user.id, selectedPayment);

                if (res && res.id) {
                    setOrderID(res.id);
                    const payRes = await getPaymentQrcode(res.id, selectedPayment, selectedPoint);

                    if (payRes && payRes.errcode === 0) {
                        payRes.order_id = res.id;
                        payRes.order_date = new Date();
                        payRes.point_id = selectedPoint.post_id;
                        payRes.payment = selectedPayment;
                        localStorage.setItem(lastOrderKey, JSON.stringify(payRes));
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
        }
    };

    const handleCheckOrder = async (order_id: number) => {
        try {
            const res = await checkOrder(order_id);
            if (res && res.status && res.status === "completed") {
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
            <PopUp open={open} title={selectedPayment.description} buttonText="已支付" hideClose={false}
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

            <div className={`${styles["shop-container"]} ${theme === "dark" ? styles["shop-container-dark"] :""}`}>
                <div className={styles["shop-header"]}>
                    <span className={styles["shop-header-title"]}>
                        选择积分套餐
                    </span>
                </div>
                <div className={styles["shop-body"]}>
                    {loading ? (<Loading/>) : (
                        <div className={styles["shop-card"]}>

                            {points.sort((a, b) => parseFloat(a.meta_data.sale_price) - parseFloat(b.meta_data.sale_price)).map((item: point, index: number) => (
                                <div key={index}
                                     className={`${styles["shop-card-item"]} ${selectedPoint.post_id == item.post_id ? styles["shop-card-item-selected"] : ""}`}
                                     onClick={() => setSelectedPoint(item)}>

                                    <div className={styles["shop-card-item-title"]}>
                                        {item.post_title}
                                        <span>AI币</span>
                                    </div>
                                    <div className={styles["shop-card-price"]}>
                                        <div className={styles["shop-card-price-title"]}>
                                            原价
                                        </div>
                                        <div className={styles["shop-card-item-regular_price"]}>
                                            ¥{item.meta_data.regular_price}
                                        </div>
                                    </div>
                                    <div className={styles["shop-card-price"]}>
                                        <div className={styles["shop-card-price-title"]}>
                                            折扣价
                                        </div>
                                        <div className={styles["shop-card-item-price"]}>
                                            ¥{item.meta_data.sale_price}
                                        </div>
                                    </div>
                                    {useage.map((item: any, index: number) => (
                                        <div key={item.id} className={styles["shop-card-price"]}>
                                            <div className={styles["shop-card-price-title"]}>
                                                {item.name}
                                            </div>
                                            <div className={styles["shop-card-item-info"]}>
                                                {item.useage +"ai币/次"}
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
                            {Payment.map((item: payment, index: number) => (
                                <div key={index}
                                     className={`${styles["shop-card-item"]} ${selectedPayment.id == item.id ? styles["shop-card-item-selected"] : ""}`}
                                     onClick={() => setSelectedPayment(item)}>
                                    <div
                                        className={`${styles["shop-card-item-title"]} ${styles["shop-card-item-title-payment"]}`}>
                                        {item.payment_method_title}
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
                            {selectedPoint.meta_data && selectedPoint.meta_data.sale_price ? "¥" + selectedPoint.meta_data.sale_price : ""}
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