import axios from "axios";
import {TransRes} from "./types";
import md5 from "crypto-js/md5";

export async function getTransResult(content: string): Promise<TransRes> {
    const salt = (new Date).getTime();
    try {
        const res = await axios.get('api/translate/api/trans/vip/translate', {
            params: {
                q: content,
                from: 'zh',
                to: 'en',
                appid: process.env.NEXT_PUBLIC_BAIDU_TRANS_APPID,
                salt: salt,
                sign: md5(`${process.env.NEXT_PUBLIC_BAIDU_TRANS_APPID}${content}${salt}${process.env.NEXT_PUBLIC_BAIDU_TRANS_KEY}`).toString()
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}