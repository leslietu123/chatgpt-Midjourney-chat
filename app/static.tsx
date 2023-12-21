import {itemUV, Iw, Modle, Quality, Size, Version} from "./api/backapi/types";
import {Path} from "@/app/constant";
import { HiPaintBrush,HiMiniHome,HiChatBubbleLeftRight, HiMiniSparkles, HiMiniEllipsisHorizontal } from "react-icons/hi2";
import {Icon} from "@chakra-ui/react";
import {ReactComponentElement} from "react";
import {ForbiddenWords} from "@/app/api/back/types";

export const models: Modle[] = [
    {id: 1, name: "midjourney", title: "MJ", img: "./Midjourney.png", value: ""},
    {id: 2, name: "niji", title: "Niji", img: "./miji.png", value: " --niji"},
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
    {id: 5, name: "v6", description: "v6", value: " --v 6"},
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
            icon: "./mj-logo2.png",
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

export interface IMenu {
    name: string;
    title: string;
    icon: ReactComponentElement<any> | string;
    icon_dark: string;
    icon_light: string;
    icon_active: string;
    path: string;
    path_name: string;
}

export const menu:IMenu[] = [
    {
        name: "Home",
        title: "主页",
        icon: <Icon as={HiMiniHome} width="20px" height="20px" color="inherit" />,
        icon_dark: "./home-dark.svg",
        icon_light: "./home-light.svg",
        icon_active: "./home-active.svg",
        path: Path.Home,
        path_name: "/",
    },
    {
        name: "Chat",
        title: "AI 对话",
        icon: <Icon as={HiChatBubbleLeftRight} width="20px" height="20px" color="inherit" />,
        icon_dark: "./chat-dark.svg",
        icon_light: "./chat-light.svg",
        icon_active: "./chat-active.svg",
        path: Path.Chat,
        path_name: "/chat",
    },
    {
        name: "Draw",
        title: "AI 绘画",
        icon: <Icon as={HiPaintBrush} width="20px" height="20px" color="inherit" />,
        icon_dark: "./draw-dark.svg",
        icon_light: "./draw-light.svg",
        icon_active: "./draw-active.svg",
        path: Path.Draw,
        path_name: "/draw",
    },
    {
        name: "Ground",
        title: "绘画广场",
        icon: <Icon as={HiMiniSparkles} width="20px" height="20px" color="inherit" />,
        icon_dark: "./ground-dark.svg",
        icon_light: "./ground-light.svg",
        icon_active: "./ground-active.svg",
        path: Path.Ground,
        path_name: "/ground",
    },
    {
        name: "Ground",
        title: "更多功能开发中",
        icon: <Icon as={HiMiniEllipsisHorizontal} width="20px" height="20px" color="inherit" />,
        icon_dark: "./ground-dark.svg",
        icon_light: "./ground-light.svg",
        icon_active: "./ground-active.svg",
        path: '#',
        path_name: "/ground",
    }
]


export const forbiddenWords:ForbiddenWords[] = [
    {
        id: 1,
        words: "Blood"
    },
    {
        id: 2,
        words: "Cutting"
    },
    {
        id: 3,
        words: "Twerk"
    },
    {
        id: 4,
        words: "Making love"
    },
    {
        id: 5,
        words: "Voluptuous"
    },
    {
        id: 6,
        words: "Naughty"
    },
    {
        id: 7,
        words: "Wincest"
    },
    {
        id: 8,
        words: "Orgy"
    },
    {
        id: 9,
        words: "XXX"
    },
    {
        id: 10,
        words: "No clothes"
    },
    {
        id: 11,
        words: "Au naturel"
    },
    {
        id: 12,
        words: "No shirt"
    },
    {
        id: 13,
        words: "Decapitate"
    },
    {
        id: 14,
        words: "Bare"
    },
    {
        id: 15,
        words: "Nude"
    },
    {
        id: 16,
        words: "Barely dressed"
    },
    {
        id: 17,
        words: "Nude"
    },
    {
        id: 18,
        words: "Bra"
    },
    {
        id: 19,
        words: "Risque"
    },
    {
        id: 20,
        words: "Clear"
    },
    {
        id: 21,
        words: "Scantily clad"
    },
    {
        id: 22,
        words: "Cleavage"
    },
    {
        id: 23,
        words: "Stripped"
    },
    {
        id: 24,
        words: "Infested"
    },
    {
        id: 25,
        words: "Full frontal"
    },
    {
        id: 26,
        words: "Unclothed"
    },
    {
        id: 27,
        words: "Invisible clothes"
    },
    {
        id: 28,
        words: "Wearing nothing"
    },
    {
        id: 29,
        words: "Lingerie"
    },
    {
        id: 30,
        words: "With no shirt"
    },
    {
        id: 31,
        words: "Naked"
    },
    {
        id: 32,
        words: "Without clothes on"
    },
    {
        id: 33,
        words: "Negligee"
    },
    {
        id: 34,
        words: "Zero clothes"
    },
    {
        id: 35,
        words: "Gruesome"
    },
    {
        id: 36,
        words: "Fascist"
    },
    {
        id: 37,
        words: "Nazi"
    },
    {
        id: 38,
        words: "Prophet Mohammed"
    },
    {
        id: 39,
        words: "Slave"
    },
    {
        id: 40,
        words: "Coon"
    },
    {
        id: 41,
        words: "Honkey"
    },
    {
        id: 42,
        words: "Cocaine"
    },
    {
        id: 43,
        words: "Heroin"
    },
    {
        id: 44,
        words: "Meth"
    },
    {
        id: 45,
        words: "Crack"
    },
    {
        id: 46,
        words: "Kill"
    },
    {
        id: 47,
        words: "Belle Delphine"
    },
    {
        id: 48,
        words: "Hitler"
    },
    {
        id: 49,
        words: "Jinping"
    },
    {
        id: 50,
        words: "Lolita"
    },
    {
        id: 51,
        words: "President Xi"
    },
    {
        id: 52,
        words: "Torture"
    },
    {
        id: 53,
        words: "Disturbing"
    },
    {
        id: 54,
        words: "Farts"
    },
    {
        id: 55,
        words: "Fart"
    },
    {
        id: 56,
        words: "Poop"
    },
    {
        id: 57,
        words: "Infected"
    },
    {
        id: 58,
        words: "Warts"
    },
    {
        id: 59,
        words: "Shit"
    },
    {
        id: 60,
        words: "Brown pudding"
    },
    {
        id: 61,
        words: "Bunghole"
    },
    {
        id: 62,
        words: "Vomit"
    },
    {
        id: 63,
        words: "Voluptuous"
    },
    {
        id: 64,
        words: "Seductive"
    },
    {
        id: 65,
        words: "Sperm"
    },
    {
        id: 66,
        words: "Hot"
    },
    {
        id: 67,
        words: "Sexy"
    },
    {
        id: 68,
        words: "Sadist"
    },
    {
        id: 69,
        words: "Sensored"
    },
    {
        id: 70,
        words: "Censored"
    },
    {
        id: 71,
        words: "Silenced"
    },
    {
        id: 72,
        words: "Deepfake"
    },
    {
        id: 73,
        words: "Inappropriate"
    },
    {
        id: 74,
        words: "Pus"
    },
    {
        id: 75,
        words: "Waifu"
    },
    {
        id: 76,
        words: "MP5"
    },
    {
        id: 77,
        words: "Succubus"
    },
    {
        id: 78,
        words: "1488"
    },
    {
        id: 79,
        words: "Slaughter"
    },
    {
        id: 80,
        words: "Surgery"
    },
    {
        id: 81,
        words: "Reproduce"
    },
    {
        id: 82,
        words: "Crucified"
    },
    {
        id: 83,
        words: "Seductively"
    },
    {
        id: 84,
        words: "Explicit"
    },
    {
        id: 85,
        words: "Inappropriate"
    },
    {
        id: 86,
        words: "Large bust"
    },
    {
        id: 87,
        words: "Explicit"
    },
    {
        id: 88,
        words: "Wang"
    },
    {
        id: 89,
        words: "Inappropriate"
    },
    {
        id: 90,
        words: "Teratoma"
    },
    {
        id: 91,
        words: "Intimate"
    },
    {
        id: 92,
        words: "see through"
    },
    {
        id: 93,
        words: "Tryphophobia"
    },
    {
        id: 94,
        words: "Bloodbath"
    },
    {
        id: 95,
        words: "Wound"
    },
    {
        id: 96,
        words: "Cronenberg"
    },
    {
        id: 97,
        words: "Khorne"
    },
    {
        id: 98,
        words: "Cannibal"
    },
    {
        id: 99,
        words: "Cannibalism"
    },
    {
        id: 100,
        words: "Visceral"
    },
    {
        id: 101,
        words: "Guts"
    },
    {
        id: 102,
        words: "Bloodshot"
    },
    {
        id: 103,
        words: "Gory"
    },
    {
        id: 104,
        words: "Killing"
    },
    {
        id: 105,
        words: "Crucifixion"
    },
    {
        id: 106,
        words: "Surgery"
    },
    {
        id: 107,
        words: "Vivisection"
    },
    {
        id: 108,
        words: "Massacre"
    },
    {
        id: 109,
        words: "Hemoglobin"
    },
    {
        id: 110,
        words: "Suicide"
    },
    {
        id: 111,
        words: "Arse"
    },
    {
        id: 112,
        words: "Labia"
    },
    {
        id: 113,
        words: "Ass"
    },
    {
        id: 114,
        words: "Mammaries"
    },
    {
        id: 115,
        words: "Badonkers"
    },
    {
        id: 116,
        words: "Bloody"
    },
    {
        id: 117,
        words: "Minge"
    },
    {
        id: 118,
        words: "Big Ass"
    },
    {
        id: 119,
        words: "Mommy Milker"
    },
    {
        id: 120,
        words: "Booba"
    },
    {
        id: 121,
        words: "Nipple"
    },
    {
        id: 122,
        words: "Oppai"
    },
    {
        id: 123,
        words: "Booty"
    },
    {
        id: 124,
        words: "Organs"
    },
    {
        id: 125,
        words: "Bosom"
    },
    {
        id: 126,
        words: "Ovaries"
    },
    {
        id: 127,
        words: "Flesh"
    },
    {
        id: 128,
        words: "Breasts"
    },
    {
        id: 129,
        words: "Penis"
    },
    {
        id: 130,
        words: "Busty"
    },
    {
        id: 131,
        words: "Phallus"
    },
    {
        id: 132,
        words: "Clunge"
    },
    {
        id: 133,
        words: "Sexy Female"
    },
    {
        id: 134,
        words: "Crotch"
    },
    {
        id: 135,
        words: "Skimpy"
    },
    {
        id: 136,
        words: "Dick"
    },
    {
        id: 137,
        words: "Thick"
    },
    {
        id: 138,
        words: "Bruises"
    },
    {
        id: 139,
        words: "Girth"
    },
    {
        id: 140,
        words: "Titty"
    },
    {
        id: 141,
        words: "Honkers"
    },
    {
        id: 142,
        words: "Vagina"
    },
    {
        id: 143,
        words: "Hooters"
    },
    {
        id: 144,
        words: "Veiny"
    },
    {
        id: 145,
        words: "Knob"
    },
    {
        id: 146,
        words: "Ahegao"
    },
    {
        id: 147,
        words: "Pinup"
    },
    {
        id: 148,
        words: "Ballgag"
    },
    {
        id: 149,
        words: "Car crash"
    },
    {
        id: 150,
        words: "Playboy"
    },
    {
        id: 151,
        words: "Bimbo"
    },
    {
        id: 152,
        words: "Pleasure"
    },
    {
        id: 153,
        words: "Bodily fluids"
    },
    {
        id: 154,
        words: "Pleasures"
    },
    {
        id: 155,
        words: "Boudoir"
    },
    {
        id: 156,
        words: "Rule34"
    },
    {
        id: 157,
        words: "Brothel"
    },
    {
        id: 158,
        words: "Seducing"
    },
    {
        id: 159,
        words: "Dominatrix"
    },
    {
        id: 160,
        words: "Corpse"
    },
    {
        id: 161,
        words: "Seductive"
    },
    {
        id: 162,
        words: "Erotic"
    },
    {
        id: 163,
        words: "Seductive"
    },
    {
        id: 164,
        words: "Fuck"
    },
    {
        id: 165,
        words: "Sensual"
    },
    {
        id: 166,
        words: "Hardcore"
    },
    {
        id: 167,
        words: "Sexy"
    },
    {
        id: 168,
        words: "Hentai"
    },
    {
        id: 169,
        words: "Shag"
    },
    {
        id: 170,
        words: "Horny"
    },
    {
        id: 171,
        words: "Crucified"
    },
    {
        id: 172,
        words: "Shibari"
    },
    {
        id: 173,
        words: "Incest"
    },
    {
        id: 174,
        words: "Smut"
    },
    {
        id: 175,
        words: "JAV"
    },
    {
        id: 176,
        words: "Succubus"
    },
    {
        id: 177,
        words: "Jerk off king at pic"
    },
    {
        id: 178,
        words: "Thot"
    },
    {
        id: 179,
        words: "Kinbaku"
    },
    {
        id: 180,
        words: "Transparent"
    },
    {
        id: 181,
        words: "Legs spread"
    },
    {
        id: 182,
        words: "sensuality"
    },
    {
        id: 183,
        words: "belly button"
    },
    {
        id: 184,
        words: "porn"
    },
    {
        id: 185,
        words: "patriotic"
    },
    {
        id: 186,
        words: "bleed"
    },
    {
        id: 187,
        words: "excrement"
    },
    {
        id: 188,
        words: "petite"
    },
    {
        id: 189,
        words: "seduction"
    },
    {
        id: 190,
        words: "mccurry"
    },
    {
        id: 191,
        words: "provocative"
    },
    {
        id: 192,
        words: "sultry"
    },
    {
        id: 193,
        words: "erected"
    },
    {
        id: 194,
        words: "camisole"
    },
    {
        id: 195,
        words: "tight white"
    },
    {
        id: 196,
        words: "arrest"
    },
    {
        id: 197,
        words: "see-through"
    },
    {
        id: 198,
        words: "feces"
    },
    {
        id: 199,
        words: "anus"
    },
    {
        id: 200,
        words: "revealing clothing"
    },
    {
        id: 201,
        words: "vein"
    },
    {
        id: 202,
        words: "loli"
    },
    {
        id: 203,
        words: "-edge"
    },
    {
        id: 204,
        words: "boobs"
    },
    {
        id: 206,
        words: "-backed"
    },
    {
        id: 207,
        words: "tied up"
    },
    {
        id: 208,
        words: "zedong"
    },
    {
        id: 209,
        words: "bathing"
    },
    {
        id: 210,
        words: "jail"
    },
    {
        id: 211,
        words: "reticulum"
    },
    {
        id: 212,
        words: "rear end"
    },
    {
        id: 213,
        words: "sakimichan"
    },
    {
        id: 214,
        words: "behind bars"
    },
    {
        id: 215,
        words: "shirtless"
    },
    {
        id: 216,
        words: "sakimichan"
    },
    {
        id: 217,
        words: "seductive"
    },
    {
        id: 218,
        words: "dong"
    },
    {
        id: 219,
        words: "sexi"
    },
    {
        id: 220,
        words: "sexualiz"
    },
    {
        id: 221,
        words: "sexual"
    }
]