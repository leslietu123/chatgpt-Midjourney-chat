export interface User {
    _id: string;
    name: string;
    phone: string;
    role: Role;
    updated_at: Date;
    created_at: Date;
    ref_code: string;
    memberInfo: MemberInfo;
    member: Member;
}

export type UpdateUseOwnKey ={
    active:boolean,
    key:string,
    proxy:string,
}

export interface MemberInfo {
    start_at: Date;
    end_at: Date;
    points: number;
    status: Status;
}

export interface LoginResponse {
    name: string;
    jwtToken: string;
    phone: string;
    id: string;
}

export type UserResponse = {
    data: User[];
    total: number;
}


export type AddUser = {
    name: string;
    phone: string;
    password: string;
}

export type AddUserResponse = User

export type ErrResponse = {
    message: string;
    error: string;
    statusCode: number
}

export enum Role {
    Admin = 'admin',
    Costumer = 'costumer',
}

export enum Status {
    active = 'active',
    closed = 'closed',
}

export enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Closed = 'closed',
}

export type Point = {
    _id: string,
    name: string,
    points: number,
    created_at: Date;
    updated_at: Date;
    status: Status;
    unlimited: boolean;
    consumption: consumption;
}

export interface consumption {
    mj: number,
    gpt_4:number,
    gpt_4_0314:number,
    gpt_4_0613:number,
    gpt_4_32k:number,
    gpt_4_32k_0314:number,
    gpt_4_32k_0613:number,
    gpt_4_1106_preview:number,
    gpt_4_vision_preview:number,
    gpt_3_5_turbo:number,
    gpt_3_5_turbo_0301:number,
    gpt_3_5_turbo_0613:number,
    gpt_3_5_turbo_1106:number,
    gpt_3_5_turbo_16k:number,
    gpt_3_5_turbo_16k_0613:number,
}

export enum modelEnum {
    mj = 'mj',
    gpt_4='gpt4',
    gpt_4_0314='gpt_4_0314',
    gpt_4_0613='gpt_4_0613',
    gpt_4_32k='gpt_4_32k',
    gpt_4_32k_0314='gpt_4_32k_0314',
    gpt_4_32k_0613='gpt_4_32k_0613',
    gpt_4_1106_preview='gpt_4_1106_preview',
    gpt_4_vision_preview='gpt_4_vision_preview',
    gpt_3_5_turbo='gpt_3_5_turbo',
    gpt_3_5_turbo_0301='gpt_3_5_turbo_0301',
    gpt_3_5_turbo_0613='gpt_3_5_turbo_0613',
    gpt_3_5_turbo_1106='gpt_3_5_turbo_1106',
    gpt_3_5_turbo_16k='gpt_3_5_turbo_16k',
    gpt_3_5_turbo_16k_0613='gpt_3_5_turbo_16k_0613',
}


export type Member = {
    name: string;
    created_at: Date;
    updated_at: Date;
    length: number;
    price: number;
    description: string;
    image: string;
    point: Point;
    _id: string;
    status: Status;
    unlimited: boolean;
}

export type MemberResponse = {
    data: Member[];
    total: number;
}

export type PointsResponse = {
    data: Point[];
    total: number;
}

// export type Payment ={
//     status: Status,
//     _id: string,
//     method: string,
// }

export type Order = {
    _id: string,
    name: string,
    total: number,
    user: User,
    item: Member,
    status: OrderStatus,
    payment: PaymentMethod,
    created_at: Date;
    updated_at: Date;
}

export type CreateOrder = {
    name: string;
    total: number;
    memberId: string;
    paymentId: string;
}

export type OrderResponse = {
    data: Order[];
    total: number;
}

export type GptKey = {
    isProxy: boolean,
    proxy: string,
    _id: string,
    key: string,
    status: Status,
    limit: number,
    left: number,
    created_at: Date;
    updated_at: Date;
}

export type GptKeyResponse = {
    data: GptKey[];
    total: number;
}

export type MjKey = {
    _id: string,
    status: Status,
    channel_id: string,
    guild_id: string,
    session_id: string,
    user_token: string,
    discord_proxy: string,
    created_at: Date;
    updated_at: Date;
}

export type MjKeyResponse = {
    data: MjKey[];
    total: number;
}

export type AddGptKey = {
    key?: string,
    limit?: number,
    isProxy?: boolean,
    proxy?: string,
}

export type AddGptKeyResponse = GptKey

export type AddMjKey = {
    channel_id?: string,
    guild_id?: string,
    session_id?: string,
    user_token?: string,
    discord_proxy?: string,
}

export enum paymentMethod {
    wechat = 'wechat',
    alipay = 'alipay',
}

export type PaymentMethod = {
    _id: string,
    method: paymentMethod,
    appid?: string,
    appsecret?: string,
    status: Status,
}

export type PaymentMethodResponse = {
    data: PaymentMethod[];
    total: number;
}

export type UpdatePaymentMethod = {
    appid?: string,
    appsecret?: string,
    status?: Status,
}


export type Sms = {
    _id: string;
    name: string;
    api: string;
    username: string;
    password: string;
    content: string;
    status: Status;
}

export type SmsAuthResponse = {
    status: boolean;
    message: string;
}


export type SmsSendResponse = {
    status: string;
    message: string;
}

export type Feature = {
    _id: string;
    name: string;
    code: string;
}

export type FeatureResponse = {
    data: Feature[];
    total: number;
}

export type Prompt = {
    _id: string;
    name: string;
    prompt: string;
    question: string;
    imageUrl: string;
    feature: Feature;
    weight?: string
}

export type PromptResponse = {
    data: Prompt[];
    total: number;
}

export type sendImagine = {
    action?: string;
    prompt?: string;
}

export type sendImagineRes = {
    taskId: string;
    status: string;
    action: string;
    prompt: string;
    code: number;
    msg?: string;
}

export type progressRes = {
    progress: string;
    taskId: string;
    url: string;
    user: User;
}

export type drawRes = {
    _id: string;
    content: string;
    prompt: string;
    created_at: Date;
    draw_id: string;
    flags: number;
    hash: string;
    height: number;
    width: number;
    progress: string;
    proxy_url: string;
    uri: string;
    taskId: string;
    user: User;
    options: Options[];
    url: string;
    isPublic: boolean;
    config_id: string;
    msg?: string;
}

export type Options = {
    custom: string;
    label: string;
    style: number;
    type: number;
}

export enum Action {
    IMAGINE = 'IMAGINE',
    BLEND = 'BLEND',
    DESCRIBE = "DESCRIBE",
    CUSTOM = "CUSTOM"
}


export type checkRes = {
    status: boolean;
    msg: string;
}

export enum userAction {
    mj = 'mj',
    gpt3_5 = 'gpt3_5',
    gpt4_0 = 'gpt4_0',
}

export enum LogType {
    error = 'error',
    info = 'info',
    warning = 'warning',
    debug = 'debug',
}


export type Log = {
    _id: string,
    user_id: string,
    content: string,
    type: LogType,
    created_at: string,
}

export type LogResponse = {
    data: Log[];
    total: number;
}

export type SiteConfig = {
    site_title: string,
    sub_title: string,
    description: string,
    site_logo: string,
    home_logo: string,
    front_url: string,
    base_url: string,
}

export type VisitReq = {
    ip?: string,
    user_id?: string,
    user_finger_id?: string,
    userAgent?: string,
    path?: string,
    visitDate?: Date,
    referrer?: string,
}

export type openAIKey = {
    active: boolean,
    key: string,
    proxy_url: string,
    [key: string]: any;
}

export type mjKey = {
    active: boolean,
    session_id: string,
    user_token:string,
    channel_id:string,
    server_id:string,
    [key: string]: any;
}