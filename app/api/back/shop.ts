import axios from "axios";
import {checkRes, CreateOrder, Member, Order, PaymentMethod, userAction} from "@/app/api/back/types";

export async function getMembers(): Promise<Member[]> {
    try {
        const res = await axios.get('api/back/members/onsale', {
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

export async function getPayments(): Promise<PaymentMethod[]> {
    try {
        const res = await axios.get('api/back/payment/active', {
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

export async function createNewOrder(data: CreateOrder): Promise<Order> {
    try {
        const res = await axios.post('api/back/orders/new', data, {
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

export async function Pay(id: string) {
    try {
        const res = await axios.get('api/back/orders/pay', {
            params: {
                id: id,
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

export async function checkInfo(action: userAction): Promise<checkRes> {
    try {
        const res = await axios.post('api/back/users/check',
            {
                action: action,
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

export async function checkout(action: userAction): Promise<checkRes> {
    try {
        const res = await axios.post('api/back/users/checkout',
            {
                action: action,
            }, {
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

export async function checkOrderStatus(id: string): Promise<boolean> {
    try {
        const res = await axios.get('api/back/orders/check', {
            params: {
                id: id,
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