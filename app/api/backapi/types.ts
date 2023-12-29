import {getPointsTransaction} from "@/app/api/backapi/user";
import {Feature, Prompt} from "@/app/api/back/types";

export interface ImagineParams {
    base64?: string;
    notifyHook?: string;
    prompt: string;
    state?: string;
}

// 响应接口
export interface ImagineRes {
    data: {
        code: number;
        description: string;
        properties: Record<string, unknown>;
        result: string;
    };
}

export interface FetchParams {
    user_name?: string;
    user_id?: string;
    transaction_id?: string;
    action: string;
    description: string;
    failReason: string;
    finishTime: number;
    id: string;
    imageUrl: string;
    progress: string;
    prompt: string;
    promptEn: string;
    startTime: number;
    state: string;
    status: string;
    submitTime: number;
    shared?: boolean;
    _id?: string;
}

export interface FetchRes {
    data: FetchParams;
}

export interface ChangeParams {
    action?: string;
    index?: number;
    notifyHook?: string;
    state?: string;
    taskId?: string;
}

export interface ChangeRes {
    data: {
        code: number;
        description: string;
        properties: Record<string, unknown>;
        result: string;
    };
}

export interface BlendParams {
    base64Array: string[];
}

export interface BlendRes {
    data: {
        code: number;
        description: string;
        properties: Record<string, unknown>;
        result: string;
    };
}

export interface itemUV {
    id: number;
    name: string;
    description: string;
    index: number;
    action: string;
}

export interface User {
    id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    url: string;
    description: string;
    link: string;
    locale: string;
    nickname: string;
    registered_date: string;
    source: string;
    refer_code: string;
    points: string;
    used_total_points: string;
    earn_total_point: string;
    created_date: string;
    remaining_draws: string;
}

export interface tarns {
    id: string,
    user_email: string,
    action_type: string,
    reward_id: string,
    user_reward_id: string,
    campaign_id: string,
    earn_campaign_id: string,
    note: string,
    customer_note: string,
    order_id: string,
    product_id: string,
    admin_id: string,
    points: string,
    expire_email_date: string,
    expire_date: string,
    action_process_type: string,
    referral_type: string,
    reward_display_name: string,
    required_points: string,
    discount_code: string,
    created_at: string,
    modified_at: string,
    processed_custom_note: string
}

export interface transAction {
    transactions: tarns[],
    transaction_total: number,
    offset: number,
    current_trans_count: number
}

export interface PointsTransaction {
    data: transAction,
}


export interface PointsListProps {
    email?: string;
    index?: number;
}


export interface CheckPointsParams {
    user_email: string;
    user_id: string;
    action: string;
    type?:string
}

export interface CheckPointsRes {
    data: {
        message: string;
        success: boolean,
        "transaction_id": string,
        "points_deducted": number
    }
}


export interface CheckoutParams {
    user_email: string;
    user_id: string;
    transaction_id: string;
    points: string;
    action: string;
    type?:string;
    note_data?: string;
}

export interface CheckoutRes {
    data: {
        response: {
            data: {
                success: boolean,
                data: {
                    "message": string
                }
            },
            headers?: any,
            status?: any
        },
        points_left: number
    }
}


export interface point {
    post_id: string;
    post_title: string;
    meta_data: {
        regular_price: string;
        sale_price: string;
    }
}

export interface payment {
    id: number;
    payment_method: string;
    payment_method_title: string;
    img: string,
    description: string,
}

export interface SendRes {
    data: {
        acknowledged: boolean;
        insertedId: string
    }

}


export interface SendReq {
    acknowledged: boolean;
    insertedId: string
}


export interface Draws {
    _id?: string;
    user_name?: string;
    user_id?: string;
    transaction_id?: string;
    action: string;
    description: string;
    failReason: string;
    finishTime: number;
    id: string;
    imageUrl: string;
    progress: string;
    prompt: string;
    promptEn: string;
    startTime: number;
    state: string;
    status: string;
    submitTime: number;
}

export type Modle = {
    id: number;
    name: string;
    title: string;
    img: string;
    value: string;
}

export type Size = {
    id: number;
    name: string;
    title: string;
    value: string;
    style?: string;
    width?: number;
    height?: number;
}

export type Iw ={
    id: number;
    name: string;
    title: string;
    value: string;
    style?: string;
}

export type Quality = {
    id: number;
    name: string;
    description: string;
    value: string;
}
export type Version = {
    id: number;
    name: string;
    description: string;
    value: string;
}

export type promptGen = {
    model?: Modle;
    content?: string;
    style?: string;
    size?: Size;
    quality?: Quality;
    version?: Version;
    chaos?: number;
    styled?: number;
    stop?: number;
    weird?: number;
    tile?: string;
    seed?: number;
    prompt?: any[];
    selectedPrompt: Prompt[];
    images?: string[];
    iw?: string;
}

