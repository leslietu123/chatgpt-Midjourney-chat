import axios from "axios";
import {FetchParams, SendReq, SendRes} from "@/app/api/backapi/types";

export function send(data: FetchParams): Promise<SendRes> {
    return axios.post(`/api/mongo`, data, {headers: {'Content-Type': 'application/json'}});
}

export function fetchdraws(id?: string,skip?:number,limit?:number) {
    return axios.get(`/api/mongo`,
        {
            params: {
                user_id: id,
                skip:skip,
                limit:limit
            }
        })
}