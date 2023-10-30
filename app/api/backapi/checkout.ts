import {
    CheckoutParams,
    CheckoutRes,
    CheckPointsParams,
    CheckPointsRes,
    ImagineParams, ImagineRes
} from "@/app/api/backapi/types";
import axios from 'axios';



//验证积分是否足够并创建交易订单

export async function CheckPoints(params: CheckPointsParams) {
    try {
        const response: CheckPointsRes = await axios.get('api/backapi/wp-json/api/v1/check_user_points', {
            params: params,
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
//使用积分结算

export async function Checkout(params: CheckoutParams) {
    try{
        const res=await axios.get(`api/backapi/wp-json/api/v1/pay`, {
            params: params,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_TOKEN}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
