import {itemUV, Iw, Modle, Quality, Size, Version} from "./types";
import {Path} from "@/app/constant";

export const models: Modle[] = [
    {id: 1, name: "midjourney", title: "MJ", img: "./midjourney.jpg", value: ""},
    {id: 2, name: "niji", title: "Niji", img: "./niji.jpg", value: " --niji"},
]


export const sizes: Size[] = [
    {id: 1, name: "1:1", value: " --ar 1:1", title: "头像图", style: "calc(50%)"},
    {id: 2, name: "4:3", value: " --ar 4:3", title: "媒体配图", style: "calc(25%)"},
    {id: 3, name: "3:4", value: " --ar 3:4", title: "媒体配图", style: "calc(60%)"},
    {id: 4, name: "16:9", value: " --ar 16:9", title: "电脑壁纸", style: "calc(15%)"},
    {id: 5, name: "9:16", value: " --ar 9:16", title: "海报图", style: "calc(70%)"}
]

export const iw: Iw[] = [
    {id: 1, name: "30%相似度", value: " --iw 0.25", title: "30%相似度"},
    {id: 2, name: "40%相似度", value: " --iw 0.5", title: "40%相似度"},
    {id: 3, name: "50%相似度", value: " --iw 1", title: "50%相似度"},
    {id: 4, name: "60%相似度", value: " --iw 1.25", title: "60%相似度"},
    {id: 5, name: "70%相似度", value: " --iw 1.5", title: "70%相似度"},
    {id: 6, name: "80%相似度", value: " --iw 1.75", title: "80%相似度"},
    {id: 7, name: "90%相似度", value: " --iw 2", title: "90%相似度"}
]


export const qualities: Quality [] = [
    {id: 1, name: "普通", description: "普通", value: " --quality 0.25"},
    {id: 2, name: "清晰", description: "清晰", value: " --quality 0.5"},
    {id: 3, name: "超清", description: "超清", value: " --quality 1"},
]


export const versions: Version[] = [
    {id: 1, name: "v4", description: "v4", value: " --v 4"},
    {id: 2, name: "v5", description: "v5", value: " --v 5"},
    {id: 3, name: "v5.1", description: "v5.1", value: " --v 5.1"},
    {id: 4, name: "v5.2", description: "v5.2", value: " --v 5.2"},
];


export const U: itemUV[] = [
    {id: 1, name: "U1", description: "upscale1", index: 1, action: "UPSCALE"},
    {id: 2, name: "U2", description: "upscale2", index: 2, action: "UPSCALE"},
    {id: 3, name: "U3", description: "upscale3", index: 3, action: "UPSCALE"},
    {id: 4, name: "U4", description: "upscale4", index: 4, action: "UPSCALE"},
];
export const V: itemUV[] = [
    {id: 1, name: "V1", description: "variation1", index: 1, action: "VARIATION"},
    {id: 2, name: "V2", description: "variation2", index: 2, action: "VARIATION"},
    {id: 3, name: "V3", description: "variation3", index: 3, action: "VARIATION"},
    {id: 4, name: "V4", description: "variation4", index: 4, action: "VARIATION"},
];

export const useage = [
    {id: 1, name: "gpt3.5", useage: process.env.NEXT_PUBLIC_POINTS_COST_PRE_MESSAGE},
    {id: 2, name: "gpt4", useage: process.env.NEXT_PUBLIC_POINTS_COST_PRE_MESSAGE_GPT4},
    {id: 3, name: "绘画", useage: process.env.NEXT_PUBLIC_POINTS_COST_PRE_DRAW},
]

export const homelist = {
    item1: [
        {
            id: 1,
            name: "AI问答",
            descriptions: "AI问答",
            icon: "./chatgpt.svg",
            img: "./chatgpt-bg.svg",
            path: Path.Chat
        },
        {
            id: 2,
            name: "AI绘画",
            descriptions: "AI绘画",
            icon: "./midjourney.png",
            img: "./midjourney.svg",
            path: Path.Draw
        },
    ],
    item2: [
        {id: 1, name: "AI绘画", descriptions: "AI绘画", img: "./midjourney.jpg", path: Path.Draw},
        {id: 1, name: "绘画广场", descriptions: "绘画广场", img: "./midjourney.jpg", path: Path.Draw},
        {id: 1, name: "PDF问答", descriptions: "MJ", img: "./midjourney.jpg", path: Path.Chat},
    ]
}


export const menu = [
    {
        name: "Home",
        title: "主页",
        icon_dark: "./home-dark.svg",
        icon_light: "./home-light.svg",
        icon_active: "./home-active.svg",
        path: Path.Home,
        path_name: "/",
    },
    {
        name: "Chat",
        title: "AI 对话",
        icon_dark: "./chat-dark.svg",
        icon_light: "./chat-light.svg",
        icon_active: "./chat-active.svg",
        path: Path.Chat,
        path_name: "/chat",
    },
    {
        name: "Draw",
        title: "AI 绘画",
        icon_dark: "./draw-dark.svg",
        icon_light: "./draw-light.svg",
        icon_active: "./draw-active.svg",
        path: Path.Draw,
        path_name: "/draw",
    },
    {
        name: "Ground",
        title: "绘画广场",
        icon_dark: "./ground-dark.svg",
        icon_light: "./ground-light.svg",
        icon_active: "./ground-active.svg",
        path: Path.Ground,
        path_name: "/ground",
    }
]