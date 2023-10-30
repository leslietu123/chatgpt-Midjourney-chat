import axios from "axios";
import {point,payment} from "./types";


//获取积分商品信息
export async function getPointsplan() {

    try {
        const response = await axios.get(
            `api/backapi/wp-json/api/v1/data`,
            {
                params: {
                    id: `${process.env.NEXT_PUBLIC_POINTS_CATEGORY_ID}`,
                },
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
                },
            }
        );
        return response.data;

    } catch (error) {
        console.error(error);
    }
}


//创建订单

export async function creatOrder(point: point, user_id: string,payment:payment) {

    const data = {
        payment_method: payment.payment_method,
        payment_method_title: payment.payment_method_title,
        set_paid: false,
        customer_id: user_id,
        billing: {},
        shipping: {},
        line_items: [
            {
                product_id: point.post_id,
                quantity: 1,
            },
        ],
        shipping_lines: [
            {
                method_id: "flat_rate",
                method_title: "Flat Rate",
                total: "0",
            },
        ],
    };
    try {
        const response = await axios.post(
            `api/shop-api/wp-json/wc/v3/orders`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

//请求付款二维码或付款链接

export async function getPaymentQrcode(order_id: string, payment:payment,point:point) {
    try {
        const response = await axios.post(
            `api/shop-api/wp-json/my-plugin/v1/xunhupay`,
            {
                trade_order_id: order_id,
                payment: payment.payment_method,
                total_fee: point.meta_data.sale_price,
                title: point.post_title,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
                },
            }
        );
        return JSON.parse(response.data);
    } catch (error) {
        console.error(error);
    }
}

//获取支付状态

export async function checkOrder(order_id: number) {
    try {
        const response = await axios.get(
            `api/backapi/wp-json/wc/v3/orders/${order_id}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}