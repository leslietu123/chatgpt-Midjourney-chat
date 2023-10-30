import axios from "axios";
import {ChangeParams, ChangeRes, FetchRes, ImagineParams, ImagineRes, BlendParams, BlendRes} from "./types";

export function imagine(params: ImagineParams): Promise<ImagineRes> {
    return axios.post(`/api/midjourney/mj/submit/imagine`, params);
}

export function fetch(id: string): Promise<FetchRes> {
    return axios.get(`/api/midjourney/mj/task/${id}/fetch`);
}

export function change(params: ChangeParams): Promise<ChangeRes> {
    return axios.post(`/api/midjourney/mj/submit/change`, params);
}

export function blend(params: BlendParams): Promise<BlendRes> {
    return axios.post(`/api/midjourney/mj/submit/blend`, params);
}