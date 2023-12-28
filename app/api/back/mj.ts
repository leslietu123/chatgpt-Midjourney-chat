import axios from 'axios';
import {drawRes, Feature, Prompt, PromptResponse, sendImagine, sendImagineRes} from "@/app/api/back/types";

export async function getFeatureList(page: number): Promise<{ data: Feature[], total: number }> {
    try {
        const res = await axios.get('api/back/feature/all', {
            params: {
                page: page,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}


export async function getPromptsByFeature(featureId: string): Promise<PromptResponse> {
    try {
        const res = await axios.get('api/back/prompt/feature', {
            params: {
                featureId: featureId,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function sendImagine(data: sendImagine): Promise<sendImagineRes> {
    try {
        const res = await axios.post('api/back/midjourney-api/imagine', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}


export async function getDrawsByUser(page: number): Promise<{data:drawRes[],total:number}> {
    try {
        const res = await axios.get('api/back/midjourney-api/draws', {
            params: {
                page: page,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function shareToGround(id: string): Promise<boolean> {
    console.log(id)
    try {
        const res = await axios.post('api/back/midjourney-api/share', {id: id}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getGround(page: number): Promise<drawRes[]> {
    try {
        const res = await axios.get('api/back/midjourney-api/ground', {
            params: {
                page: page,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}


export async function getImgs(data: File[]): Promise<string[]> {
    try {
        let formData = new FormData();
        data.forEach((file, index) => {
            formData.append('files', file);
        });
        console.log(formData)
        const res = await axios.post('api/back/midjourney-api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            }
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}


export async function getTaskId(): Promise<{taskId:string}> {
    try {
        const res = await axios.get('api/back/midjourney-api/task_id',{});
        console.log(res)
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}
