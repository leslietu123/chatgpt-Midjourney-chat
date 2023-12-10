import {
    AddUser,
    LoginResponse,
    User,
    ErrResponse,
    SmsAuthResponse, SmsSendResponse, LogResponse, SiteConfig, VisitReq, UpdateUseOwnKey,
} from "./types";
import axios from "axios";


export async function userLogin(phone: string, password: string): Promise<LoginResponse> {
    console.log(phone, password)
    try {
        const res = await axios.post('api/back/users/signin', {
                phone: phone,
                password: password,
            },
            {
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


export async function signUp(user: AddUser): Promise<User | ErrResponse> {
    try {
        const res = await axios.post('api/back/users/signup', user, {
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

export function isUser(result: User | ErrResponse): result is User {
    return (result as User).name !== undefined;
}

export async function sendSms(phone: string): Promise<SmsSendResponse> {
    try {
        const res = await axios.get('api/back/sms/send', {
            params: {
                phone: phone,
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

export async function authSms(phone: string, code: string): Promise<SmsAuthResponse> {
    try {
        const res = await axios.get('api/back/sms/auth', {
            params: {
                phone: phone,
                code: code,
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

export async function getMe(): Promise<User> {
    try {
        const res = await axios.get('api/back/users/me', {
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

export async function getMyLogs(page: number): Promise<LogResponse> {
    try {
        const res = await axios.get('api/back/log/me', {
            params: {
                page: page,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getConfig(): Promise<SiteConfig> {
    try {
        const res = await axios.get('api/back/site-config/config', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}


export async function addVisit(data: VisitReq): Promise<boolean> {
    try {
        const res = await axios.post('api/back/app/visit', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}


export async function updateUseOwnKey(data:UpdateUseOwnKey): Promise<User>{
    try {
        const res = await axios.patch('api/back/users/useownkey', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}







